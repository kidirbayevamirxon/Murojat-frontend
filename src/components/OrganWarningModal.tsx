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

/* API DAN KELAYOTGAN FORMAT */
interface WarningData {
  accepted: number;
  sent_to_organ: {
    today: number;
    tomorrow: number;
    within_5_days: number;
    within_15_days: number;
  };
  review: {
    today: number;
    tomorrow: number;
    within_5_days: number;
    within_15_days: number;
  };
}

interface WarningModalProps {
  open: boolean;
  onClose: () => void;
  data: WarningData | null;
}

const OrganWarningModal: React.FC<WarningModalProps> = ({ open, onClose, data }) => {
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
                <TableHead className="w-[30%] text-right">
                  {t("count")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* ACCEPTED */}
              <TableRow>
                <TableCell>{t("accepted")}</TableCell>
                <TableCell>{t("totalAccepted")}</TableCell>
                <TableCell className="text-right text-green-600 font-medium">
                  {data?.accepted ?? 0}
                </TableCell>
              </TableRow>

              {/* SENT TO ORGAN */}
              <TableRow>
                <TableCell rowSpan={4}>{t("sentToOrgan")}</TableCell>
                <TableCell>{t("today")}</TableCell>
                <TableCell className="text-right">
                  {data?.sent_to_organ?.today ?? 0}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("tomorrow")}</TableCell>
                <TableCell className="text-right">
                  {data?.sent_to_organ?.tomorrow ?? 0}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("within5Days")}</TableCell>
                <TableCell className="text-right">
                  {data?.sent_to_organ?.within_5_days ?? 0}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("within15Days")}</TableCell>
                <TableCell className="text-right">
                  {data?.sent_to_organ?.within_15_days ?? 0}
                </TableCell>
              </TableRow>

              {/* REVIEW */}
              <TableRow>
                <TableCell rowSpan={4}>{t("review")}</TableCell>
                <TableCell>{t("today")}</TableCell>
                <TableCell className="text-right">
                  {data?.review?.today ?? 0}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("tomorrow")}</TableCell>
                <TableCell className="text-right">
                  {data?.review?.tomorrow ?? 0}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("within5Days")}</TableCell>
                <TableCell className="text-right">
                  {data?.review?.within_5_days ?? 0}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t("within15Days")}</TableCell>
                <TableCell className="text-right">
                  {data?.review?.within_15_days ?? 0}
                </TableCell>
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

export default OrganWarningModal;
