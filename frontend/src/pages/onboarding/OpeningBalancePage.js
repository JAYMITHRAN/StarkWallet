import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { openingBalanceService } from "@/services/openingBalanceService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { ApiRequestError } from "@/services/apiClient";
const schema = z.object({
    amount: z.coerce.number().min(0, "Balance cannot be negative"),
});
export function OpeningBalancePage() {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const { show } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({ resolver: zodResolver(schema), defaultValues: { amount: 0 } });
    const onSubmit = async (values) => {
        try {
            await openingBalanceService.set(values);
            await refreshUser();
            show({ tone: "success", title: "Wallet ready", description: "Your opening balance has been recorded." });
            navigate("/dashboard", { replace: true });
        }
        catch (err) {
            const message = err instanceof ApiRequestError ? err.message : "Could not save your opening balance.";
            show({ tone: "danger", title: "Setup failed", description: message });
        }
    };
    return (_jsxs(Card, { children: [_jsxs("div", { className: "mb-5 flex items-center gap-2", children: [_jsx(Wallet, { className: "h-4 w-4 text-accent", "aria-hidden": true }), _jsx("h2", { className: "text-base font-semibold text-text", children: "What's your available balance?" })] }), _jsx("p", { className: "mb-5 text-sm text-text-muted", children: "Not your monthly income \u2014 just the cash and bank balance you have right now. We'll track every change from here." }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4", children: [_jsx(FormField, { label: "Current available balance", htmlFor: "amount", error: errors.amount?.message, children: _jsx(Input, { id: "amount", type: "number", step: "0.01", inputMode: "decimal", autoFocus: true, ...register("amount") }) }), _jsx(Button, { type: "submit", isLoading: isSubmitting, className: "mt-1", children: "Set up wallet" })] })] }));
}
