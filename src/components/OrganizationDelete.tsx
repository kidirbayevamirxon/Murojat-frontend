import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { axiosInstance } from "@/api/api";

interface DeleteOrganizationDrawerProps {
  open: boolean;
  onClose: () => void;
  orgId: number;
  orgName: string;
  onDeleted: () => void;
}

const DeleteOrganizationDrawer: React.FC<DeleteOrganizationDrawerProps> = ({
  open,
  onClose,
  orgId,
  orgName,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/organization/${orgId}`);
      toast.success("Organization deleted successfully!");
      onDeleted();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="bg-white rounded-t-2xl shadow-lg border-t border-red-100 [&>div:first-child]:bg-red-400">
        <DrawerHeader className="border-b border-red-100 pb-3 bg-red-50">
          <DrawerTitle className="text-red-700 font-semibold text-lg">
            🗑️ Delete Organization
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-5 space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the organization{" "}
            <span className="font-semibold">{orgName}</span>? This action cannot
            be undone.
          </p>
        </div>

        <DrawerFooter className="flex justify-end gap-2 border-t border-red-100 bg-red-50 px-5 py-3 rounded-b-2xl">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-100 bg-red-50 hover:text-red-700"
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteOrganizationDrawer;
