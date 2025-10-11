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

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="bg-white rounded-t-2xl shadow-lg border-t border-blue-100 [&>div:first-child]:bg-blue-400">
        <DrawerHeader className="border-b border-blue-100 pb-3 bg-blue-50">
          <DrawerTitle className="text-blue-700 font-semibold text-lg">
            ✏️ Edit Organization
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-5 space-y-4">
          <div>
            <Label
              htmlFor="name"
              className="text-sm font-medium text-gray-700"
            >
              Organization Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter organization name"
              className="mt-1 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mt-1 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <DrawerFooter className="flex justify-end gap-2 border-t border-blue-100 bg-blue-50 px-5 py-3 rounded-b-2xl">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-100 bg-blue-50 hover:text-blue-700"
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditOrganizationDrawer;
