import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
    HTMLInputElement,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
        onCheckedChange?: (checked: boolean) => void;
        checked?: boolean;
    }
>(({ className, onCheckedChange, checked, ...props }, ref) => {
    return (
        <div className="relative flex items-center">
            <input
                type="checkbox"
                className="peer h-4 w-4 shrink-0 opacity-0 absolute inset-0 cursor-pointer z-10"
                ref={ref}
                checked={checked}
                onChange={(e) => onCheckedChange?.(e.target.checked)}
                {...props}
            />
            <div className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-checked:bg-primary peer-checked:text-primary-foreground",
                checked ? "bg-primary text-primary-foreground" : "",
                className
            )}>
                <Check className={cn("h-3 w-3", checked || props.defaultChecked ? "block" : "hidden peer-checked:block", "text-primary-foreground")} />
            </div>
        </div>
    )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
