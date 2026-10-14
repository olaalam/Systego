// src/components/Login.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import login from "../assets/Login.jpg";
import logo from "../assets/logo.jpg";

import usePost from "@/hooks/usePost";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .toLowerCase()
    .trim(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginPage() {
  const navigate = useNavigate();

  const { postData, loading } = usePost("/api/admin/auth/login");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const res = await postData(values);

      if (res.success) {
        const { token, admin } = res.data;

        // ✅ تخزين البيانات
        localStorage.setItem("token", token);
        localStorage.setItem("admin", JSON.stringify(admin));

        // ✅ التوجيه حسب الـ role
        if (admin.role === "viewer") {
          navigate("/operation-reports");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: `url(${login})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full max-w-lg rounded-lg shadow-lg animate-fade-in-up">
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <img src={logo} alt="Logo" width={100} height={40} className="mb-2" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-purple-700 cursor-pointer"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
