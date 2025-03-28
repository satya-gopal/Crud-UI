import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface DeleteDialogProps {
  openOrNot: boolean;
  label: string;
  onCancelClick: () => void;
  onOKClick: () => void;
  deleteLoading: boolean;
  notForDelete?: boolean;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  openOrNot,
  label,
  onCancelClick,
  onOKClick,
  deleteLoading,
  notForDelete = false,
}) => {
  if (!openOrNot) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onCancelClick}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full sm:max-w-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Warning
              </h3>
              <button
                onClick={onCancelClick}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex items-start space-x-3 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm sm:text-base text-gray-600">
                {label}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancelClick}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
              >
                {notForDelete ? "No, Stay" : "Cancel"}
              </button>
              <button
                onClick={onOKClick}
                disabled={deleteLoading}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md min-w-[100px]"
              >
                {deleteLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : notForDelete ? (
                  "Yes, Cancel"
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};