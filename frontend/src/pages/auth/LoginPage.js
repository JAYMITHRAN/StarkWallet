import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { ApiRequestError } from "@/services/apiClient";
import { loginFormSchema } from "@/lib/authValidation";
export function LoginPage() {
    const navigate = useNavigate();
    const { setSession } = useAuth();
    const { show } = useToast();
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(loginFormSchema),
        mode: "onChange",
        defaultValues: { password: "" },
    });
    const password = watch("password") ?? "";
    const isReady = useMemo(() => password.trim().length > 0, [password]);
    useEffect(() => {
        if (!lockoutUntil)
            return;
        const remaining = lockoutUntil - Date.now();
        if (remaining <= 0) {
            setLockoutUntil(null);
            return;
        }
        const timer = window.setTimeout(() => setLockoutUntil(null), remaining);
        return () => window.clearTimeout(timer);
    }, [lockoutUntil]);
    const onSubmit = async (values) => {
        if (lockoutUntil && lockoutUntil > Date.now()) {
            show({ tone: "danger", title: "Too many attempts", description: "Please wait a moment before trying again." });
            return;
        }
        try {
            setSuccessMessage(null);
            const { token, user } = await authService.login(values);
            setFailedAttempts(0);
            setLockoutUntil(null);
            setSession(token, user);
            setSuccessMessage("Login successful. Redirecting...");
            show({ tone: "success", title: "Welcome back", description: "You are now signed in." });
            window.setTimeout(() => navigate(user.hasCompletedOnboarding ? "/dashboard" : "/onboarding", { replace: true }), 650);
        }
        catch (err) {
            const nextFailures = failedAttempts + 1;
            setFailedAttempts(nextFailures);
            if (nextFailures >= 3) {
                setLockoutUntil(Date.now() + 2500);
            }
            const message = err instanceof ApiRequestError ? err.message : "Could not log you in.";
            show({ tone: "danger", title: "Login failed", description: message });
        }
    };
    const secondsRemaining = lockoutUntil ? Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000)) : 0;
    return (_jsxs(Card, { className: "space-y-5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(KeyRound, { className: "h-4 w-4 text-accent", "aria-hidden": true }), _jsx("h2", { className: "text-base font-semibold text-text", children: "Welcome back" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4", noValidate: true, children: [_jsx(FormField, { label: "Password", htmlFor: "password", error: errors.password?.message, children: _jsx(PasswordInput, { id: "password", autoComplete: "current-password", autoFocus: true, placeholder: "Enter your password", ...register("password") }) }), successMessage ? (_jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-success", role: "status", children: [_jsx(CheckCircle2, { className: "h-4 w-4", "aria-hidden": true }), _jsx("span", { children: successMessage })] })) : null, lockoutUntil && lockoutUntil > Date.now() ? (_jsxs("p", { className: "text-sm text-danger", role: "alert", children: ["Too many failed attempts. Please wait ", secondsRemaining, "s before trying again."] })) : null, _jsx(Button, { type: "submit", isLoading: isSubmitting, className: "mt-1", disabled: !isReady || Boolean(lockoutUntil && lockoutUntil > Date.now()), children: "Unlock wallet" })] })] }));
}
