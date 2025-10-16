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

interface EditOrganizationDrawerProps {
  open: boolean;
  onClose: () => void;
  orgId: number;
  currentName: string;
  onUpdated: () => void;
}

const EditOrganizationDrawer: React.FC<EditOrganizationDrawerProps> = ({
  open,
  onClose,
  orgId,
  currentName,
  onUpdated,
}) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") setTheme("dark");
  }, []);

  useEffect(() => {
    if (open) {
      setName(currentName || "");
      setPassword("");
    }
  }, [open, currentName]);

  const handleUpdate = async () => {
    if (!name.trim() || !password.trim()) {
      toast.warning("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      await axiosInstance.patch(`/organization/${orgId}`, {
        new_name: name,
        new_password: password,
      });
      toast.success("Organization updated successfully!");
      onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update organization");
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
            isDark ? "border-gray-700 bg-[#1E293B]" : "border-blue-100 bg-blue-50"
          }`}
        >
          <DrawerTitle
            className={`font-semibold text-lg ${
              isDark ? "text-blue-400" : "text-blue-700"
            }`}
          >
            ✏️ Edit Organization
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
              Organization Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter organization name"
              className={`mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isDark
                  ? "bg-[#1E293B] border-gray-700 text-gray-200 placeholder-gray-400"
                  : "border-blue-300"
              }`}
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
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
            isDark ? "border-gray-700 bg-[#1E293B]" : "border-blue-100 bg-blue-50"
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
              Cancel
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
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditOrganizationDrawer;
