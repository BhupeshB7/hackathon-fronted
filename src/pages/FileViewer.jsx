import React, { useState, useEffect } from "react";
import {
  Download,
  FileText,
  Image,
  Video,
  File,
  Share,
  ArrowLeft,
  EllipsisVertical, 
  Info, 
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ImageView from "@/components/ImageView";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { useDirectory } from "@/hooks/UseDirectory"; 
import DetailsModal from "@/components/DetailsModal";

const FileViewer = ({ mode }) => {
  const { fileId } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();   
  const { refetch } = useDirectory();
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsType, setDetailsType] = useState("file");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const handleShowDetails = (type, id) => {
    console.log("Showing details for:", type, id);
    setSelectedItem(id);
    setDetailsType(type);
    setShowDetailsModal(true);
  };
  
  useEffect(() => {
    fetchFileData(fileId);
  }, [fileId]);
  const fetchFileData = async (fileId) => {
    try {
      const url =
        mode === "private"
          ? `https://hackathon-backend-chi-two.vercel.app/api/files/${fileId}/metadata`
          : `https://hackathon-backend-chi-two.vercel.app/api/files/public/${fileId}/metadata`;
      const res = await axios.get(url, { withCredentials: true });
      console.log(res.data)
      setFile(res.data);
      setLoading(false);
    } catch (error) {
      toast.error(error);
      setError(error);
    }
  };

  const preventContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  const preventDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  const preventSelection = (e) => {
    e.preventDefault();
    return false;
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <Image className="w-6 h-6" />;
    if (type.startsWith("video/")) return <Video className="w-6 h-6" />;
    if (type === "application/pdf" || type.startsWith("text/"))
      return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const renderFileContent = () => {
    if (!file) return null;

    const commonProps = {
      onContextMenu: preventContextMenu,
      onDragStart: preventDragStart,
      onSelectStart: preventSelection,
      style: { userSelect: "none" },
    };

    if (file.type.startsWith("image/")) {
      return (
        <div className="flex justify-center items-center h-full bg-gradient-to-r from-indigo-100 to-white dark:from-gray-900 dark:to-gray-950  rounded-lg">
          <ImageView src={file.url} alt={file.name} zoomOnClick={true} />
        </div>
      );
    }

    if (file.type.startsWith("video/")) {
      return (
        <div className="flex justify-center items-center h-full bg-gray-50 rounded-lg">
          <video
            src={file.url}
            controls
            className="w-full h-full"
            controlsList="nodownload"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (file.type === "application/pdf") {
      return (
        <div
          className="h-full bg-gray-50 rounded-lg overflow-auto"
          onContextMenu={(e) => e.preventDefault()}
        >
          <iframe
            src={`${file.url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full rounded-lg overflow-auto"
            title={file.name}
            {...commonProps}
          />
        </div>
      );
    }

    if (file.type.startsWith("text/")) {
      return (
        <div className="h-full bg-white rounded-lg border overflow-auto">
          <div className="p-6">
            <iframe
              src={file.url}
              className="w-full h-[80vh] rounded-lg"
              title={file.name}
            />
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <File className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            File not found
          </h2>
          <p className="text-gray-500">
            The file you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen "
      onContextMenu={preventContextMenu}
      style={{ userSelect: "none" }}
    >
      {/* Header */}
      <div className="  sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* File Info */}
            <div className="flex items-center space-x-4">
              <div className="text-blue-600">{getFileIcon(file.type)}</div>
              <div>
                <h1 className="text-lg font-medium text-gray-900 dark:text-gray-200 truncate max-w-md">
                  {file.name}
                </h1>
                <p className="text-sm text-gray-500">{file.uploadDate}</p>
              </div>
            </div>

            {file.fileMode === "private" && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    (window.location.href = `https://hackathon-backend-chi-two.vercel.app/api/files/${file.id}?action=download`)
                  }
                  className="flex items-center justify-center p-2 text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-3"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button className="flex items-center justify-center p-2 text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-3">
                  <Share className="w-4 h-4 " />
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className=" p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                      <EllipsisVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 space-y-1"> 
                    <DropdownMenuItem
                   onClick={() => handleShowDetails("file", file.id)}
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Details
                    </DropdownMenuItem> 
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {file.fileMode === "private" ? (
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2 mb-1"
          >
            <ArrowLeft className="w-4 h-4 " />
            Back
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="gap-2 mb-1"
          >
            <ArrowLeft className="w-4 h-4 " />
            Back
          </Button>
        )}
        <div className="bg-white rounded-lg shadow-sm    ">
          <div className="h-[calc(100vh-8rem)]">{renderFileContent()}</div>
        </div>
      </div> 
      {showDetailsModal && selectedItem && (
        <DetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          type={detailsType}
          id={selectedItem}
        />
      )}
    </div>
  );
};

export default FileViewer;
