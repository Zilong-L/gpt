import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
            });
            const json = await res.json();
            if (!res.ok) throw Error(json.message);
            console.log(json);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignUp = async () => {
        if (loading) return;
        try {
            setLoading(true);
            toast.info("Loading..."); // Display loading toast
            const res = await fetch("api/auth/signup", {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
            });

            // Remove loading toast
            toast.dismiss();

            if (res.status === 409) {
                console.log("User already exists");
                toast.error("User already exists"); // Display error toast
            } else if (res.status === 201) {
                toast.success("User created successfully"); // Display success toast
            } else {
                console.log("haha");
                toast.error("An error occurred"); // Display error toast
            }
        } catch (e) {
            console.log("haha");
            toast.error("An error occurred"); // Display error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign In/Sign Up
                </h1>
                <form className="mt-8 space-y-6">
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email:
                            </label>
                            <input
                                id="email-address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password:
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 items-center justify-center  gap-4 align-middle">
                        <button
                            type="button"
                            onClick={handleSignIn}
                            disabled={loading}
                            className={`group relative flex w-full justify-center rounded-md border border-transparent ${
                                loading ? "bg-indigo-400" : "bg-indigo-600"
                            } py-2 px-4 text-sm font-medium text-white ${
                                loading
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:bg-indigo-700"
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={handleSignUp}
                            disabled={loading}
                            className={`group relative flex w-full justify-center rounded-md border border-transparent ${
                                loading ? "bg-indigo-50" : "bg-indigo-100"
                            } py-2 px-4 text-sm font-medium text-indigo-700 ${
                                loading
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:bg-indigo-200"
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;
