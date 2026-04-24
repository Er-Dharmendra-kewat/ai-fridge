import { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Auth({ setUser }) {
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const handleSubmit = async () => {
        try {
            if (!isLogin && form.password !== form.confirmPassword) {
                return alert("Passwords do not match");
            }

            const url = isLogin
                ? "http://localhost:5000/api/auth/login"
                : "http://localhost:5000/api/auth/signup";

            const res = await axios.post(url, form);

            // 🔥 LOGIN FLOW (FIXED)
            if (isLogin) {
                if (!res.data.token) {
                    return alert("Token not received from server");
                }

                localStorage.setItem("token", res.data.token);

                setUser({
                    token: res.data.token
                });

            } else {
                // SIGNUP FLOW
                alert("Signup successful. Now login.");
                setIsLogin(true);
            }

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };


    return (
        <div style={containerStyle}>
            <div style={cardStyle}>

                <h2 style={titleStyle}>
                    {isLogin ? "Welcome Back" : "Create Your Account"}
                </h2>

                <p style={subtitleStyle}>
                    Manage your smart fridge easily
                </p>

                {/* EMAIL */}
                <div style={inputWrapper}>
                    <FaEnvelope style={iconStyle} />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        style={inputStyle}
                        autoComplete="off"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                </div>

                {/* PASSWORD */}
                <div style={inputWrapper}>
                    <FaLock style={iconStyle} />

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        style={inputStyle}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    {showPassword ? (
                        <FaEyeSlash
                            style={eyeStyle}
                            onClick={() => setShowPassword(false)}
                        />
                    ) : (
                        <FaEye
                            style={eyeStyle}
                            onClick={() => setShowPassword(true)}
                        />
                    )}
                </div>

                {/* CONFIRM PASSWORD */}
                {!isLogin && (
                    <div style={inputWrapper}>
                        <FaLock style={iconStyle} />

                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm password"
                            style={inputStyle}
                            onChange={(e) =>
                                setForm({ ...form, confirmPassword: e.target.value })
                            }
                        />

                        {showConfirm ? (
                            <FaEyeSlash
                                style={eyeStyle}
                                onClick={() => setShowConfirm(false)}
                            />
                        ) : (
                            <FaEye
                                style={eyeStyle}
                                onClick={() => setShowConfirm(true)}
                            />
                        )}
                    </div>
                )}

                {/* BUTTON */}
                <button onClick={handleSubmit} style={btnStyle}>
                    {isLogin ? "Login" : "Sign Up"}
                </button>

                {/* SWITCH */}
                <p style={switchText}>
                    {isLogin ? "No account?" : "Already have an account?"}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={switchLink}
                    >
                        {isLogin ? " Register" : " Login"}
                    </span>
                </p>

            </div>
        </div>
    );
}

/* ===== STYLES ===== */

const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100%"
};

const cardStyle = {
    width: 420,
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 16,
    padding: 30,
    color: "#fff",
    boxShadow: "0 0 40px rgba(0,0,0,0.5)"
};

const titleStyle = { textAlign: "center", marginBottom: 8 };

const subtitleStyle = {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 20
};

const inputWrapper = {
    display: "flex",
    alignItems: "center",
    background: "#020817",
    border: "1px solid #334155",
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 16
};

const iconStyle = {
    color: "#64748b",
    marginRight: 10
};

const inputStyle = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: 14
};

const eyeStyle = {
    color: "#64748b",
    cursor: "pointer",
    marginLeft: 10
};

const btnStyle = {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: 10
};

const switchText = { textAlign: "center", marginTop: 15 };

const switchLink = { color: "#38bdf8", cursor: "pointer" };