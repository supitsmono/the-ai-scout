"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Settings,
    User,
    Building2,
    Bell,
    Shield,
    Save,
    CheckCircle2,
    Zap,
    Image,
    Mail,
    Phone,
    FileText,
    Ruler,
    Trash2,
    Key,
    Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [email, setEmail] = useState("user@aiscout.com");
    const [agencyName, setAgencyName] = useState("Your Agency");
    const [fullName, setFullName] = useState("Agency User");
    const [autoCleanupDays, setAutoCleanupDays] = useState(10);
    const [requireAllPhotos, setRequireAllPhotos] = useState(true);
    const [requirePhone, setRequirePhone] = useState(true);
    const [requireEmail, setRequireEmail] = useState(true);
    const [requireMotivation, setRequireMotivation] = useState(false);
    const [requireExactHeight, setRequireExactHeight] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);

    const handleSave = () => {
        // TODO: Save to backend
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Account Settings</h1>
                    <p className="text-slate-400 text-sm">Manage your account, agency preferences, and application requirements</p>
                </div>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        onClick={handleSave}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 shadow-lg shadow-cyan-500/20"
                        disabled={saved}
                    >
                        {saved ? (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Saved
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Information */}
                    <SettingsCard
                        icon={<User className="w-5 h-5" />}
                        title="Account Information"
                        description="Your personal account details"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-slate-300 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Full Name
                                </Label>
                                <Input
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500"
                                    placeholder="your@email.com"
                                />
                                <p className="text-xs text-slate-500">This email receives magic link login codes</p>
                            </div>
                        </div>
                    </SettingsCard>

                    {/* Agency Information */}
                    <SettingsCard
                        icon={<Building2 className="w-5 h-5" />}
                        title="Agency Details"
                        description="Your agency branding and information"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="agencyName" className="text-slate-300 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Agency Name
                                </Label>
                                <Input
                                    id="agencyName"
                                    value={agencyName}
                                    onChange={(e) => setAgencyName(e.target.value)}
                                    className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500"
                                    placeholder="Your Agency"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 flex items-center gap-2">
                                    <Image className="w-4 h-4" />
                                    Agency Logo
                                </Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center">
                                        <Building2 className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <div className="flex-1">
                                        <Button
                                            variant="outline"
                                            className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                                            size="sm"
                                        >
                                            Upload Logo
                                        </Button>
                                        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SettingsCard>

                    {/* Application Requirements */}
                    <SettingsCard
                        icon={<Zap className="w-5 h-5" />}
                        title="Application Requirements"
                        description="Set what models must submit before applying"
                    >
                        <div className="space-y-4">
                            <ToggleSwitch
                                icon={<Image className="w-4 h-4" />}
                                label="Require all 4 photos"
                                checked={requireAllPhotos}
                                onChange={setRequireAllPhotos}
                                description="Models must upload 4 photos to apply"
                            />
                            <Separator className="bg-white/5" />
                            <ToggleSwitch
                                icon={<Phone className="w-4 h-4" />}
                                label="Require phone number"
                                checked={requirePhone}
                                onChange={setRequirePhone}
                                description="Phone number is mandatory for applications"
                            />
                            <Separator className="bg-white/5" />
                            <ToggleSwitch
                                icon={<Mail className="w-4 h-4" />}
                                label="Require email address"
                                checked={requireEmail}
                                onChange={setRequireEmail}
                                description="Email address is required for magic link login"
                            />
                            <Separator className="bg-white/5" />
                            <ToggleSwitch
                                icon={<FileText className="w-4 h-4" />}
                                label="Require motivation message"
                                checked={requireMotivation}
                                onChange={setRequireMotivation}
                                description="Models must include a motivation message"
                            />
                            <Separator className="bg-white/5" />
                            <ToggleSwitch
                                icon={<Ruler className="w-4 h-4" />}
                                label="Require exact height (cm)"
                                checked={requireExactHeight}
                                onChange={setRequireExactHeight}
                                description="Height must be specified in centimeters"
                            />
                        </div>
                    </SettingsCard>

                    {/* Automation */}
                    <SettingsCard
                        icon={<Zap className="w-5 h-5" />}
                        title="Automation"
                        description="Automated pipeline management"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="autoCleanup" className="text-slate-300 flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Auto-delete Rejected Models
                                </Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        id="autoCleanup"
                                        type="number"
                                        min={1}
                                        max={90}
                                        value={autoCleanupDays}
                                        onChange={(e) => setAutoCleanupDays(Number(e.target.value))}
                                        className="bg-slate-900/50 border-white/10 text-white w-24"
                                    />
                                    <span className="text-sm text-slate-400">days after rejection</span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Rejected models will be automatically deleted after this period
                                </p>
                            </div>
                        </div>
                    </SettingsCard>
                </div>

                {/* Right Column - Sidebar Settings */}
                <div className="space-y-6">
                    {/* Notifications */}
                    <SettingsCard
                        icon={<Bell className="w-5 h-5" />}
                        title="Notifications"
                        description="Manage your notification preferences"
                    >
                        <div className="space-y-4">
                            <ToggleSwitch
                                label="Email Notifications"
                                checked={emailNotifications}
                                onChange={setEmailNotifications}
                                description="Receive updates via email"
                            />
                            <Separator className="bg-white/5" />
                            <ToggleSwitch
                                label="Push Notifications"
                                checked={pushNotifications}
                                onChange={setPushNotifications}
                                description="Browser push notifications"
                            />
                        </div>
                    </SettingsCard>

                    {/* Security */}
                    <SettingsCard
                        icon={<Shield className="w-5 h-5" />}
                        title="Security"
                        description="Account security settings"
                    >
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full border-white/10 text-slate-300 hover:text-white hover:bg-white/5 justify-start"
                            >
                                <Key className="w-4 h-4 mr-2" />
                                Change Password
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-white/10 text-slate-300 hover:text-white hover:bg-white/5 justify-start"
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                Two-Factor Authentication
                            </Button>
                        </div>
                    </SettingsCard>

                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-1">Magic Link Login</h4>
                                <p className="text-xs text-slate-400">
                                    Models receive a secure magic link via email when you contact them. No passwords needed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsCard({
    icon,
    title,
    description,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400">
                    {icon}
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <p className="text-xs text-slate-500">{description}</p>
                </div>
            </div>
            {children}
        </motion.div>
    );
}

function ToggleSwitch({
    icon,
    label,
    checked,
    onChange,
    description,
}: {
    icon?: React.ReactNode;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}) {
    return (
        <div className="space-y-1">
            <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3 flex-1">
                    {icon && (
                        <div className="text-slate-400 group-hover:text-slate-300 transition-colors">
                            {icon}
                        </div>
                    )}
                    <div className="flex-1">
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors block">
                            {label}
                        </span>
                        {description && (
                            <span className="text-xs text-slate-500 block mt-0.5">{description}</span>
                        )}
                    </div>
                </div>
                <motion.button
                    type="button"
                    onClick={() => onChange(!checked)}
                    whileTap={{ scale: 0.95 }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                        checked ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                >
                    <motion.span
                        layout
                        className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
                        animate={{
                            x: checked ? 22 : 2,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                        }}
                    />
                </motion.button>
            </label>
        </div>
    );
}
