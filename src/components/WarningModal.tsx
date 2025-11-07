import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface WarningData {
  pending?: number;
  accepted?: number;
  sentToOrgan?: {
    today: number;
    tomorrow: number;
    within5Days: number;
    within15Days: number;
  };
  review?: {
    today: number;
    tomorrow: number;
    within5Days: number;
    within15Days: number;
  };
}

interface WarningModalProps {
  open: boolean;
  onClose: () => void;
  data: WarningData;
}

const WarningModal: React.FC<WarningModalProps> = ({ open, onClose, data }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={22} />
            <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {t("warningTitle")}
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("warningDescription")}
          </p>
        </DialogHeader>

        <div className="overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">{t("status")}</TableHead>
                <TableHead className="w-[40%]">{t("category")}</TableHead>
                <TableHead className="w-[30%] text-right">{t("count")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{t("pending")}</TableCell>
                <TableCell>{t("totalPending")}</TableCell>
                <TableCell className="text-right text-yellow-600 font-medium">
                  {data.pending ?? 0}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("accepted")}</TableCell>
                <TableCell>{t("totalAccepted")}</TableCell>
                <TableCell className="text-right text-green-600 font-medium">
                  {data.accepted ?? 0}
                </TableCell>
              </TableRow>

              {/* Sent to Organ */}
              <TableRow>
                <TableCell rowSpan={4}>{t("sentToOrgan")}</TableCell>
                <TableCell>{t("today")}</TableCell>
                <TableCell className="text-right">{data.sentToOrgan?.today ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("tomorrow")}</TableCell>
                <TableCell className="text-right">{data.sentToOrgan?.tomorrow ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("within5Days")}</TableCell>
                <TableCell className="text-right">{data.sentToOrgan?.within5Days ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("within15Days")}</TableCell>
                <TableCell className="text-right">{data.sentToOrgan?.within15Days ?? 0}</TableCell>
              </TableRow>

              {/* Review */}
              <TableRow>
                <TableCell rowSpan={4}>{t("review")}</TableCell>
                <TableCell>{t("today")}</TableCell>
                <TableCell className="text-right">{data.review?.today ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("tomorrow")}</TableCell>
                <TableCell className="text-right">{data.review?.tomorrow ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("within5Days")}</TableCell>
                <TableCell className="text-right">{data.review?.within5Days ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("within15Days")}</TableCell>
                <TableCell className="text-right">{data.review?.within15Days ?? 0}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="secondary">
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WarningModal;
