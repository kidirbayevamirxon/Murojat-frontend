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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/api/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface AddQuarterDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const AddQuarterDrawer: React.FC<AddQuarterDrawerProps> = ({
  open,
  onClose,
  onAdded,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.warning(t("fillAllFields"));
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/quarter/quarter", {
        name,
      });

      toast.success(t("addSuccess"));
      setName("");
      onAdded();
      onClose();
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error(t("sessionExpired"));
        navigate("/login");
      } else {
        toast.error(t("addError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="bg-white dark:bg-[#1a2533] rounded-t-2xl shadow-lg border-t border-blue-100 dark:border-blue-900 [&>div:first-child]:bg-blue-400 dark:[&>div:first-child]:bg-blue-600">
        <DrawerHeader className="border-b border-blue-100 dark:border-blue-900 pb-3 bg-blue-50 dark:bg-blue-900/20 mt-4">
          <DrawerTitle className="text-blue-700 dark:text-blue-300 font-semibold text-lg">
            + {t("addQuarter") || "Add Quarter"}
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-5 space-y-4">
          <div>
            <Label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("quarterName") || "Quarter name"}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("enterQuarterName") || "Enter quarter name"}
              className="mt-1 border-blue-300 dark:border-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#1a2533] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
        </div>

        <DrawerFooter className="flex justify-end gap-2 border-t border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 px-5 py-3 rounded-b-2xl">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 bg-blue-50 dark:bg-transparent hover:text-blue-700 dark:hover:text-blue-300"
            >
              {t("cancel")}
            </Button>
          </DrawerClose>

          <Button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
          >
            {loading ? t("saving") : t("save")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddQuarterDrawer;
