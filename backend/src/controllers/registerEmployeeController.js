    // nodemailer: send emails via SMTP
// crypto: generate random code
// jsonwebtoken: generate token
// bcryptjs: encrypt password

import nodemailer from "nodemailer"
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcrypt from "bcryptjs"

const registerEmployeeController = {}
import employeeModel from "../models/employees.js"
import { config } from "../../config.js";

registerEmployeeController.register = async (req, res) => {
	const {
		name,
		lastName,
		salary,
		DUI,
		phone,
		email,
		password,
		isVerified,
		loginAttempts,
		timeOut,
		idBranch
	} = req.body;

	try {
		// Check if employee already exists
		const existEmployee = await employeeModel.findOne({ email })
		if (existEmployee) {
			return res.status(400).json({ message: "Employee already exist" })
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, 10)

		// Normalize idBranch: accept either a string or MongoDB Extended JSON like { "$oid": "..." }
		let normalizedIdBranch = idBranch
		if (normalizedIdBranch && typeof normalizedIdBranch === 'object') {
			// If client sent { "$oid": "..." } (e.g., exported from Mongo), extract the string
			if (Object.prototype.hasOwnProperty.call(normalizedIdBranch, '$oid')) {
				normalizedIdBranch = String(normalizedIdBranch.$oid)
			} else {
				// If it's an object with an _id or toStringable value, try to convert
				try {
					normalizedIdBranch = String(normalizedIdBranch)
				} catch (e) {
					normalizedIdBranch = undefined
				}
			}
		}

		// Create new employee (pass normalized idBranch)
		const newEmployee = new employeeModel({
			name,
			lastName,
			salary,
			DUI,
			phone,
			email,
			password: passwordHash,
			isVerified,
			loginAttempts,
			timeOut,
			idBranch: normalizedIdBranch
		})

		await newEmployee.save();

		// Generate verification code and token
		const verificationCode = crypto.randomBytes(3).toString("hex")

		const tokenCode = jsonwebtoken.sign(
			{ email, verificationCode },
			config.JWT.secret,
			{ expiresIn: "15m" }
		)

		res.cookie("verificationToken", tokenCode, { maxAge: 15 * 60 * 1000 })

		// Send verification email
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: config.email.user_email,
				pass: config.email.user_password,
			}
		})

		const mailOptions = {
			from: config.email.user_email,
			to: email,
			subject: "Verificación de cuenta - Empleado",
			text: "Para verificar tu cuenta como empleado, utiliza este código: " + verificationCode + " Ten en cuenta que expira en 15 minutos"
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log("error: " + error)
				return res.status(500).json({ message: "error" })
			}
			res.status(200).json({ message: "Employee registered, verify your email" })
		})

	} catch (error) {
		console.log("error: " + error)
		return res.status(500).json({ message: "Error registering employee: Internal server error" })
	}

}

registerEmployeeController.verifyCode = async (req, res) => {
	try {
		const { verificationCodeRequest } = req.body;

		const token = req.cookies.verificationToken
		const decoded = jsonwebtoken.verify(token, config.JWT.secret)
		const { email, verificationCode: storedCode } = decoded;

		if (verificationCodeRequest !== storedCode) {
			return res.status(400).json({ message: "invalid code" })
		}

		const employee = await employeeModel.findOne({ email });
		if (!employee) {
			return res.status(404).json({ message: "Employee not found" })
		}

		employee.isVerified = true;
		await employee.save();

		res.clearCookie("verificationToken")

		res.json({ message: "Email verified succesfully" })
	}
	catch (error) {
		console.log("error" + error)
		return res.status(500).json({ message: "Internal server error" })
	}
}

export default registerEmployeeController;

