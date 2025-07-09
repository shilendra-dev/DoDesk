import axios from 'axios';
import {React} from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../../shared/components/molecules/FormField';
import { useForm } from 'react-hook-form';

function SignUpForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const password = watch("password");
    const onSubmit = async (data) => {
        try{
            const res = await axios.post("http://localhost:5033/api/users/signup", data);
            console.log(res.data);

            navigate(`/`);
            window.location.reload();
        }catch(err){
            console.error(err);
        }
    };
    return (
    <>
        <div className="rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Create an Account</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                <FormField
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    {...register("name", {required: "Name is required"})}
                    error ={errors.name?.message}
                />

                <FormField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address",
                        },
                    })}
                    error={errors.email?.message}
                />

                <FormField
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="********"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    })}
                    error={errors.password?.message}
                />

                <FormField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="********"
                    {...register("confirmPassword", {
                    validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    error={errors.confirmPassword?.message}
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Sign Up
                </button>
            </form>
            </div>
        </div>
    </>
  )
}

export default SignUpForm