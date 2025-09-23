// src/components/Login.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom"; // 👈 مهم

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import login from "../assets/login.jpg";
import logo from "../assets/logo.png";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginPage() {
  const navigate = useNavigate(); // 👈 نادينا الهُوك
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values) {
    console.log(values);
    // هنا ممكن تعملي API call لو عندك
    // وبعد النجاح
    navigate("/"); // 👈 يروح على الصفحة الرئيسية
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
          <img
            src={logo}
            alt="SalePro Logo"
            width={100}
            height={40}
            className="mb-2"
          />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={"text-secondary"}>UserName</FormLabel>
                    <FormControl>
                      <Input placeholder="superadmin" {...field} />
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
                    <FormLabel className={"text-secondary"}>Password </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-secondary hover:bg-purple-700 cursor-pointer">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
