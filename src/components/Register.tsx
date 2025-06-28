import { useState, type FC } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import '../styles.css'
import { useNavigate } from "react-router-dom";
import { ROUTEPATHS } from "../routing";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCRAILContext } from "../contexts/useCRAILContext";
import { POST } from "../api/apiWrapper";

interface FormDataTypes {
    name: string;
    email: string;
    domain: 'Healthcare' | 'Logistics' | '';
    password: string;
    confirmPassword: string;
}

const Register: FC = () => {
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useCRAILContext(); // Assuming useCRAILContext is defined in your context file

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormDataTypes>({
        defaultValues: {
            name: '',
            email: '',
            domain: '', // Default to empty string for placeholder
            password: '',
            confirmPassword: '',
        }
    });

    const password = watch("password");

    const onSubmit: SubmitHandler<FormDataTypes> = async (data) => {
        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError('');
        console.log(data);

        await POST('/register', dispatch, data, { headers: { 'Content-Type': 'application/json' } })
        console.log("Registration successful");
        navigate(ROUTEPATHS.LOGIN); // Navigate to login after successful registration

    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"> {/* Softer, easy-on-eye background */}
            <div className="bg-white rounded-3xl px-8 py-10 w-full max-w-md flex flex-col items-center"> {/* Removed shadow-xl */}
                <div className="mb-8 w-full">
                    <h1 className="text-[28px] text-center font-extrabold leading-[1.2] font-baloo text-gray-800"> {/* Increased font size, darker text */}
                        Smart Email Actuator
                    </h1>
                    <h2 className="text-[22px] text-center font-semibold leading-[1.2] text-gray-600 mt-2"> {/* Slightly smaller, lighter text */}
                        <span className="text-blue-600"> {/* Themed color for "Register to SMA" */}
                            Register to SMA
                        </span>
                    </h2>
                </div>
                <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1"> {/* Updated label style */}
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            placeholder="Your Name"
                            className="form-input bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-gray-900" // Updated input style
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Invalid email address"
                                }
                            })}
                            placeholder="Your email address"
                            className="form-input bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-gray-900"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                            Domain
                        </label>
                        <select
                            id="domain"
                            {...register("domain", { required: "Domain is required", validate: value => value !== '' || "Please select a domain" })} // Added validation for empty string
                            className="form-input bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-gray-900 appearance-none pr-8" // Added appearance-none for custom arrow, pr-8 for space
                            defaultValue="" // Set default value to empty string for placeholder
                        >
                            <option value="" disabled hidden>Select a Domain</option> {/* Placeholder option */}
                            <option value="Healthcare">Healthcare</option>
                            <option value="Logistics">Logistics</option>
                        </select>
                        {errors.domain && <p className="text-red-500 text-xs mt-1">{errors.domain.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                autoComplete="new-password"
                                className="form-input bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-gray-900 pr-10"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" // Adjusted icon color
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <HiEyeOff size={20} />
                                ) : (
                                    <HiEye size={20} />
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                className="form-input bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-gray-900 pr-10"
                                {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: value =>
                                        value === password || "Passwords do not match"
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" // Adjusted icon color
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <HiEyeOff size={20} />
                                ) : (
                                    <HiEye size={20} />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>
                    {error && (
                        <div
                            role="alert"
                            className="flex items-center p-3 text-sm text-red-800 rounded-lg bg-red-50 mt-2" // Updated error alert style
                        >
                            <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span className="sr-only">Info</span>
                            <div>
                                {error}
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" // Themed button style
                    >
                        Register
                    </button>
                </form>
                <div className="text-center mt-6 text-sm w-full text-gray-600"> {/* Adjusted text size and color */}
                    <div className="row-auto">
                        <span>Already have an account? </span>
                        <button
                            className="font-medium text-blue-600 hover:text-blue-700" // Themed link color
                            onClick={() => navigate(ROUTEPATHS.LOGIN)}
                        >
                            Login
                        </button>
                    </div>
                </div>
                <div className="mt-2 text-sm text-gray-500 text-center w-full"> {/* Adjusted text color */}
                    Need assistance? Contact us:{' '}
                    <a
                        href="mailto:sma@gmail.com"
                        className="font-medium text-blue-600 hover:text-blue-700" // Themed link color
                    >
                        sma@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Register