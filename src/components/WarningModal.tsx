import React from "react";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={22} />
            <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Warning
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Critical application statuses require your attention.
          </p>
        </DialogHeader>

        <div className="overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Status</TableHead>
                <TableHead className="w-[40%]">Category</TableHead>
                <TableHead className="w-[30%] text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Pending</TableCell>
                <TableCell>Total Pending</TableCell>
                <TableCell className="text-right text-yellow-600 font-medium">
                  {data.pending ?? 0}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Accepted</TableCell>
                <TableCell>Total Accepted</TableCell>
                <TableCell className="text-right text-green-600 font-medium">
                  {data.accepted ?? 0}
                </TableCell>
              </TableRow>

              {/* Sent to Organ */}
              <TableRow>
                <TableCell rowSpan={4}>Sent to Organ</TableCell>
                <TableCell>Today</TableCell>
                <TableCell className="text-right">{data.sentToOrgan?.today ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tomorrow</TableCell>
                <TableCell className="text-right">{data.sentToOrgan?.tomorrow ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Within 5 days</TableCell>
                <TableCell className="text-right">{data.sentToOrgan?.within5Days ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Within 15 days</TableCell>
                <TableCell className="text-right">{data.sentToOrgan?.within15Days ?? 0}</TableCell>
              </TableRow>

              {/* Review */}
              <TableRow>
                <TableCell rowSpan={4}>Review</TableCell>
                <TableCell>Today</TableCell>
                <TableCell className="text-right">{data.review?.today ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tomorrow</TableCell>
                <TableCell className="text-right">{data.review?.tomorrow ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Within 5 days</TableCell>
                <TableCell className="text-right">{data.review?.within5Days ?? 0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Within 15 days</TableCell>
                <TableCell className="text-right">{data.review?.within15Days ?? 0}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WarningModal;
