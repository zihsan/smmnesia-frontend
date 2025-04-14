import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layout/Layout";
import { LuArrowRight, LuHouse, LuUserRoundSearch } from "react-icons/lu";
import Breadcrumbs from "@/components/Breadcrumbs";
import Input from "@/components/Input";
import Card from "@/components/Card";
import AvatarRing from "@/components/AvatarRing";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    
        try {
            const result = await login(username, password);
    
            if (result?.success) {
                console.log("✅ Login berhasil, redirecting...");
                router.push("/admin/dashboard");
            } else {
                const errorMessage = result?.message || "Login failed";
                console.warn("❌ Login gagal:", errorMessage);
                setError(errorMessage);
                setTimeout(() => setError(""), 3000);
            }
        } catch (error) {
            console.error("❌ Unexpected error saat login:", error);
            setError("An unexpected error occurred");
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Breadcrumbs
                items={[
                    {
                        href: "/",
                        icon: <LuHouse />,
                        label: "Home",
                    },
                    {
                        href: "/auth/login",
                        icon: <LuUserRoundSearch />,
                        label: "Login",
                    },
                ]}
                className="mt-4 sm:mt-8 bg-[#5395FF]"
            />
            <Card className="mt-6 p-6">
                <div className="flex flex-col items-center mt-6">
                    <AvatarRing src="/favicon.avif" className="w-36" />
                    <p className="text-2xl mt-4">SmmNesia</p>
                </div>
                <div className="card-body p-3">
                    <form onSubmit={handleSubmit}>
                        <div className="-space-y-0.5">
                            <Input
                                className="bg-[#5395FF]"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <Input
                                className="bg-[#5395FF]"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            className="w-full mt-6"
                            bgColor="#5395FF"
                            hoverColor="#DDEBFF"
                            type="submit"
                            disabled={loading}
                        >
                            {error ? (
                                <span className="text-red-500">{error}</span>
                            ) : loading ? (
                                <Loading className="loading-spinner loading-xs" />
                            ) : (
                                <>
                                    <LuArrowRight className="mr-1" />
                                    LOGIN
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </Card>
        </Layout>
    );
};

export default Login;