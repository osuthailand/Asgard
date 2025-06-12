"use client"; // Mark this component as a Client Component

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { Turnstile } from "@marsidev/react-turnstile";
import { Card, CardBody } from "@nextui-org/react"; // Import NextUI components
import Container from "../components/container"; // Import the Container component

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false); // Track registration success

  // Get query parameters from the URL
  const searchParams = useSearchParams();
  const username = searchParams.get("username"); // Get username from URL
  const email = searchParams.get("email"); // Get email from URL

  const getClientIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Failed to fetch IP address:", error);
      return null;
    }
  };

  const onSubmit = async (data) => {
    if (!captchaToken) {
      setMessage("Please complete the captcha.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      // Get the user's IP address
      const cf_connecting_ip = await getClientIp();
      if (!cf_connecting_ip) {
        throw new Error("Unable to retrieve IP address.");
      }

      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("cf_turnstile_response", captchaToken);
      formData.append("cf_connecting_ip", cf_connecting_ip); // Add IP address

      const apiUrl = "https://api.rina.place"; // Hardcoded API URL

      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setIsRegistered(true); // Set registration success
        setMessage("Registration successful!");
      } else {
        setMessage(result.detail || "Registration failed.");
      }
    } catch (error) {
      setMessage("Internal Error"); // Display a generic error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container> {/* Wrap the content in the Container component */}
      <div
        className={
          "py-4 px-[14rem] -md:px-[4rem] rounded-md bg-content1 bg-cover bg-center " +
          "text-center flex justify-center -md:flex-col -md:gap-4"
        }
        style={{ backgroundImage: "url('/images/registration.jpg')" }}
      >
        <Card className="w-full max-w-md p-6"> {/* Fixed form size */}
          <CardBody>
            {isRegistered ? ( // Show success message if registered
              <>
                <h2 className="text-2xl font-bold mb-6 text-center">Registration Complete!</h2>
                <p className="text-center text-default-600">
                  Please log in to the game to activate your account. The server is currently under development, so something may break. Please report any issues you encounter.
                </p>
              </>
            ) : ( // Show registration form if not registered
              <>
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                {message && (
                  <p className={`mb-4 text-center ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                    {message}
                  </p>
                )}
                <form onSubmit={(e) => {
                  e.preventDefault(); // Prevent page reload
                  handleSubmit(onSubmit)(e);
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                      type="text"
                      {...register("username", { required: "Username is required" })}
                      defaultValue={username || ""} // Autofill username
                      className="w-full p-2 rounded-lg border border-default-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      {...register("email", { required: "Email is required" })}
                      defaultValue={email || ""} // Autofill email
                      className="w-full p-2 rounded-lg border border-default-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      {...register("password", { required: "Password is required" })}
                      className="w-full p-2 rounded-lg border border-default-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>
                  <div className="flex justify-center">
                    <Turnstile 
                      siteKey="0x4AAAAAABCKI-wCUvGIAWAG" 
                      onSuccess={setCaptchaToken} 
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </form>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}