import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EllipsisVertical, ArrowLeft, Activity } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Navbar from "@/components/Navbar";
import getFileIcon from "@/utils/getFileIcon";
import { deleteFile } from "@/api/fileDirectoryApi";
import { useDirectory } from "@/hooks/UseDirectory";

const RecentFiles = () => {
  const navigate = useNavigate();
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refetch } = useDirectory();

  const fetchRecentFiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/files/recent`, {
        withCredentials: true,
      });
      setAllFiles(res.data.data || []);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentFiles();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              📂 Recent Files
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              View and manage your recently accessed files.
            </p>
          </div>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* File Grid or Empty Message */}
        {loading ? (
          <p className="text-center text-muted">Loading files...</p>
        ) : allFiles.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center text-[var(--muted-foreground)]">
            <div className="w-32 h-32 bg-[var(--surface-variant)] rounded-full flex items-center justify-center mb-6">
              <Activity className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold mb-1">No Files Found</h2>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md">
              You haven’t uploaded or opened any files yet. Start using your
              cloud storage to see files here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {allFiles.map((fileItem) => (
              <div
                key={fileItem._id}
                className="relative p-4 border border-[var(--border)] rounded-lg bg-[var(--card)] hover:bg-[var(--surface-variant)] transition-colors duration-200 cursor-pointer"
              >
                <a href={`/file/${fileItem._id}`} className="block">
                  <div className="flex items-center gap-3">
                    {getFileIcon(fileItem.name)}
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {fileItem.name}
                      </p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {fileItem.extension}
                      </p>
                    </div>
                  </div>
                </a>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                      <EllipsisVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => alert(`Details of ${fileItem.name}`)}
                    >
                      Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        (window.location.href = `http://localhost:3000/api/files/${fileItem._id}?action=download`)
                      }
                    >
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => deleteFile(fileItem._id, refetch)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RecentFiles;
