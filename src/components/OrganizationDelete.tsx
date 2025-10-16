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
      <DrawerContent className="bg-white dark:bg-[#1a2533] rounded-t-2xl shadow-lg border-t border-red-100 dark:border-red-900 [&>div:first-child]:bg-red-400 dark:[&>div:first-child]:bg-red-600">
        <DrawerHeader className="border-b border-red-100 dark:border-red-900 pb-3 bg-red-50 dark:bg-red-900/20 mt-4">
          <DrawerTitle className="text-red-700 dark:text-red-300 font-semibold text-lg">
            🗑️ Delete Organization
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-5 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the organization{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">{orgName}</span>? This action cannot
            be undone.
          </p>
        </div>
        <DrawerFooter className="flex justify-end gap-2 border-t border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-5 py-3 rounded-b-2xl">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="border-red-500 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 bg-red-50 dark:bg-transparent hover:text-red-700 dark:hover:text-red-300"
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteOrganizationDrawer;