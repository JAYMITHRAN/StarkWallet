import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { ApiRequestError } from "@/services/apiClient";
import { createPasswordFormSchema } from "@/lib/authValidation";
export function CreatePasswordPage() {
    const navigate = useNavigate();
    const { setSession } = useAuth();
    const { show } = useToast();
    const [successMessage, setSuccessMessage] = useState(null);
    const { register, handleSubmit, watch, formState: { errors, isSubmitting, isValid }, } = useForm({
        resolver: zodResolver(createPasswordFormSchema),
        mode: "onChange",
        defaultValues: { password: "", confirmPassword: "" },
    });
    const password = watch("password") ?? "";
    const confirmPassword = watch("confirmPassword") ?? "";
    const isReady = useMemo(() => password.length >= 8 && password === confirmPassword && isValid, [confirmPassword, isValid, password]);
    const onSubmit = async (values) => {
        try {
            setSuccessMessage(null);
            const { token, user } = await authService.createPassword(values);
            setSession(token, user);
            setSuccessMessage("Password created successfully. Redirecting to the next step...");
            show({ tone: "success", title: "Password created", description: "Your password is secure and ready to use." });
            window.setTimeout(() => navigate("/onboarding", { replace: true }), 650);
        }
        catch (err) {
            const message = err instanceof ApiRequestError ? err.message : "Could not create your password.";
            show({ tone: "danger", title: "Setup failed", description: message });
        }
    };
    return (_jsxs(Card, { className: "space-y-5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Lock, { className: "h-4 w-4 text-accent", "aria-hidden": true }), _jsx("h2", { className: "text-base font-semibold text-text", children: "Create your password" })] }), _jsx("p", { className: "text-sm text-text-muted", children: "This is a single-user wallet. Choose a password you'll remember \u2014 there is no email recovery." }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4", noValidate: true, children: [_jsx(FormField, { label: "Password", htmlFor: "password", error: errors.password?.message, children: _jsx(PasswordInput, { id: "password", autoComplete: "new-password", placeholder: "Create a secure password", ...register("password") }) }), _jsx(PasswordStrength, { password: password }), _jsx(FormField, { label: "Confirm password", htmlFor: "confirmPassword", error: errors.confirmPassword?.message, children: _jsx(PasswordInput, { id: "confirmPassword", autoComplete: "new-password", placeholder: "Re-enter your password", ...register("confirmPassword") }) }), successMessage ? (_jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm text-success", role: "status", children: [_jsx(CheckCircle2, { className: "h-4 w-4", "aria-hidden": true }), _jsx("span", { children: successMessage })] })) : null, _jsx(Button, { type: "submit", isLoading: isSubmitting, className: "mt-1", disabled: !isReady, children: "Create password" })] })] }));
}
