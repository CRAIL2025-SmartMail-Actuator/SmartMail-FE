import { useState, type FC } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import '../styles.css'
import { useNavigate } from "react-router-dom";
import { ROUTEPATHS } from "../routing";

interface FormDataTypes {
    password: string;
    username: string;
    confirmPassword?: string;
}

const Register: FC = () => {
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState<FormDataTypes>({
        password: '',
        username: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            return { ...prev, [name]: value }
        })
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#d0f1f7] to-[#e2eafc]">
            <div className="bg-white rounded-3xl shadow-xl px-8 py-10 w-full max-w-md flex flex-col items-center">
                <div className="mb-8 w-full">
                    <h1 className="text-[24px] text-center font-bold leading-[1.2] font-baloo">
                        Smart Email Acutuator
                    </h1>
                    <h2 className="text-[24px] text-center font-bold leading-[1.2]">
                        <span className="login-header">
                            Register to SMA
                        </span>
                    </h2>
                </div>
                <form className="w-full flex flex-col gap-5">
                    <div>
                        <label htmlFor="username" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Student email"
                            className="form-input bg-transparent w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                value={formData.password}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                autoComplete="new-password"
                                className="form-input bg-transparent w-full pr-10"
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D1D5DB] hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <HiEyeOff size={20} />
                                ) : (
                                    <HiEye size={20} />
                                )}
                            </button>
                        </div>

                    </div>
                    <div>
                        <label htmlFor="password" className="form-label">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                value={formData.confirmPassword}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Password"
                                autoComplete="new-password"
                                className="form-input bg-transparent w-full pr-10"
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D1D5DB] hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <HiEyeOff size={20} />
                                ) : (
                                    <HiEye size={20} />
                                )}
                            </button>
                        </div>

                    </div>
                    {error && (
                        <div
                            role="alert"
                            className="amplify-flex amplify-alert amplify-alert--error mt-2"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"></path></svg>
                            <div style={{ flex: '1 1 0%' }}>
                                <div className="amplify-alert__body">
                                    {error}
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="registration-button w-full mt-2"
                        onClick={() => { }}
                    >
                        Register
                    </button>
                </form>
                <div className="text-center mt-6 text-smallSize w-full">
                    <div className="row-auto">
                        <span>Already have an account? </span>
                        <button
                            className="font-medium"
                            onClick={() => navigate(ROUTEPATHS.LOGIN)}
                        >
                            Login
                        </button>
                    </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 text-center w-full">
                    Need assistance? Contact us:{' '}
                    <a
                        href="mailto:sma@gmail.com"
                        className="font-medium"
                    >
                        sma@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Register