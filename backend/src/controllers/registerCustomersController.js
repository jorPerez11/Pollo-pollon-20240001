import nodemailer from "nodemailer"
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import customerModel from "../models/customers.js"
import { config } from "../../config.js"

const registerCustomerController = {}

registerCustomerController.register = async (req, res) => {
    const {
        name,
        lastName,
        birthdate,
        email,
        password,
        isVerified,
        loginAttempts,
        timeOut
    } = req.body

    try {
        // 1. Verificar si el cliente ya existe
        const existCustomer = await customerModel.findOne({ email })
        if (existCustomer) {
            return res.status(400).json({ message: "Customer already exists" })
        }

        // 2. Encriptar la contraseña
        const passwordHash = await bcryptjs.hash(password, 10)

        const newCustomer = new customerModel({
            name,
            lastName,
            birthdate,
            email,
            password: passwordHash,
            isVerified: isVerified || false,
            loginAttempts: loginAttempts || 0,
            timeOut: timeOut || 0
        });

        await newCustomer.save();

        // 3. Generar código y Token
        const verificacionCode = crypto.randomBytes(3).toString("hex")

        const tokenCode = jsonwebtoken.sign(
            { email, verificacionCode },
            config.JWT.secret,
            { expiresIn: "15m" }
        );

        // 4. Guardar Cookie (Nombre: verificationToken)
        res.cookie("verificationToken", tokenCode, { 
            httpOnly: true, // Por seguridad: impide acceso desde JS del navegador
            maxAge: 15 * 60 * 1000 
        })

        // 5. Configurar envío de correo
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password
            }
        })

        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Verificación de cuenta",
            text: `Para verificar tu cuenta, utiliza este código: ${verificacionCode}. Expira en 15 minutos.`
        }

        // 6. Enviar correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error enviando email: " + error)
                return res.status(500).json({ message: "Error sending email" })
            }
            res.status(200).json({ message: "Customer registered, verify your email" })
        })

    } catch (error) {
        console.log("Error en registro: " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

// VERIFICAR EL CÓDIGO
registerCustomerController.verifyCode = async (req, res) => {
    try {
        const { verificationCodeRequest } = req.body;
        
        const token = req.cookies.verificationToken;

        // Validar si el token existe antes de intentar verificarlo
        if (!token) {
            return res.status(400).json({ message: "Verification session expired or not found" });
        }

        // Verificar el JWT
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
        const { email, verificacionCode: storedCode } = decoded

        // Comparar códigos
        if (verificationCodeRequest !== storedCode) {
            return res.status(400).json({ message: "Invalid code" })
        }

        // Si es correcto, actualizar usuario
        const customer = await customerModel.findOne({ email });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        customer.isVerified = true;
        await customer.save();

        // Limpiar cookie y responder
        res.clearCookie("verificationToken")
        res.json({ message: "Email verified successfully" })

    } catch (error) {
        console.log("Error en verificación: " + error)
        
        // Manejar error específico de JWT expirado
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "The code has expired" });
        }
        
        return res.status(500).json({ message: "Internal server error" })
    }
}

export default registerCustomerController;