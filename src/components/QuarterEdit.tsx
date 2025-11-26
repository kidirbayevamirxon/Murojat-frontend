import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/api/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface EditQuarterDrawerProps {
  open: boolean;
  onClose: () => void;
  quarterId: number;
  currentName: string;
  onUpdated: () => void;
}

const EditQuarterDrawer: React.FC<EditQuarterDrawerProps> = ({
  open,
  onClose,
  quarterId,
  currentName,
  onUpdated,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") setTheme("dark");
  }, []);

  useEffect(() => {
    if (open) {
      setName(currentName || "");
    }
  }, [open, currentName]);

 const handleUpdate = async () => {
  if (!name.trim()) {
    toast.warning(t("fillAllFields"));
    return;
  }

  try {
    setLoading(true);
    await axiosInstance.patch(`/quarter/${quarterId}`, 
      { name },
      { params: { org_id: quarterId} }
    );

    toast.success(t("updateSuccess"));
    onUpdated();
    onClose();
  } catch (error: any) {
    if (error.response?.status === 401) {
      toast.error(t("sessionExpired"));
      navigate("/login");
    } else {
      toast.error(t("updateError"));
      console.error("Update error:", error);
    }
  } finally {
    setLoading(false);
  }
};


  const isDark = theme === "dark";

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent
        className={`rounded-t-2xl shadow-lg border-t transition-colors duration-300 ${
          isDark
            ? "bg-[#101922] border-gray-800 text-gray-300"
            : "bg-white border-blue-100 text-gray-800"
        }`}
      >
        <DrawerHeader
          className={`border-b pb-3 mt-2 ${
            isDark
              ? "border-gray-700 bg-[#1E293B]"
              : "border-blue-100 bg-blue-50"
          }`}
        >
          <DrawerTitle
            className={`font-semibold text-lg ${
              isDark ? "text-blue-400" : "text-blue-700"
            }`}
          >
            ✏️ {t("editQuarter") || "Edit Quarter"}
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-5 space-y-4">
          <div>
            <Label
              htmlFor="name"
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("quarterName") || "Quarter name"}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("enterQuarterName") || "Enter quarter name"}
              className={`mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isDark
                  ? "bg-[#1E293B] border-gray-700 text-gray-200 placeholder-gray-400"
                  : "border-blue-300"
              }`}
            />
          </div>
        </div>

        <DrawerFooter
          className={`flex justify-end gap-2 border-t px-5 py-3 rounded-b-2xl ${
            isDark
              ? "border-gray-700 bg-[#1E293B]"
              : "border-blue-100 bg-blue-50"
          }`}
        >
          <DrawerClose asChild>
            <Button
              variant="outline"
              className={`transition-all ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-blue-500 text-blue-600 hover:bg-blue-100 bg-blue-50"
              }`}
            >
              {t("cancel")}
            </Button>
          </DrawerClose>

          <Button
            onClick={handleUpdate}
            disabled={loading}
            className={`transition-all ${
              isDark
                ? "bg-blue-700 hover:bg-blue-800 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? t("saving") : t("saveChanges")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditQuarterDrawer;
