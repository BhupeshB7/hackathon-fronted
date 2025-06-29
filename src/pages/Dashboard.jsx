import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeftSquare,
  Download,
  File,
  Folder,
  Info,
  Link2,
  Pencil,
  Plus,
  Share2,
  Star,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  deleteFile,
  handleCopyLink,
  handleCreateDirectory,
  handleDeleteDir,
  handleRenameDirOrFile,
  handleStarred,
} from "@/api/fileDirectoryApi";
import { useState } from "react";
import CreateDirectoryModal from "@/components/CreateDirectoryModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import RenameModal from "@/components/RenameModal";
import FileUpload from "@/components/FileUpload";
import { useDirectoryContext } from "@/contexts/DirectoryContext";
import getFileIcon from "@/utils/getFileIcon";
import ShareModal from "@/components/ShareModal";
import FuzzySearchBar from "@/components/FuzzySearchBar";
import DetailsModal from "@/components/DetailsModal";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { parentId } = useParams();
  const navigate = useNavigate();
  const { directory, refetch, allFiles } = useDirectoryContext(parentId);
  const [newDirname, setNewDirname] = useState("");
  const [renameType, setRenameType] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameId, setRenameId] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsType, setDetailsType] = useState("file");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const handleShowDetails = (type, id) => {
    console.log("Showing details for:", type, id);
    setSelectedItem(id);
    setDetailsType(type);
    setShowDetailsModal(true);
  };
  const handleGenerateLink = (email, mode) => {
    console.log("Generating link for:", email, "with mode:", mode);
    // TODO: Call backend or logic to generate shareable link
    setIsShareModalOpen(false);
  };
  const handleOpenRenameModalOpen = (type, id, value) => {
    setRenameType(type);
    setRenameId(id);
    setRenameValue(value);
    setIsRenameModalOpen(true);
  };

  const handleRename = async (e) => {
    e.preventDefault();
    const success = await handleRenameDirOrFile(
      renameType,
      renameId,
      renameValue,
      refetch
    );
    if (success) {
      setIsRenameModalOpen(false);
    }
  };

  const handleModalCreate = async (e) => {
    e.preventDefault();
    const success = await handleCreateDirectory(parentId, newDirname, refetch);
    if (success) {
      setNewDirname("");
      setIsModalOpen(false);
    }
  };

  const goBack = () => navigate(-1);

  return (
    <main>
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          My Drive
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Store, sync, and share your files
        </p>
      </div>
      <FuzzySearchBar />
      {parentId && (
        <div
          onClick={goBack}
          className="flex items-center gap-2 cursor-pointer text-blue-600 hover:underline w-fit my-4"
        >
          <ArrowLeftSquare className="w-5 h-5" /> Back
        </div>
      )}

      <div className="flex justify-between mb-4">
        {directory.length > 0 && (
          <h3 className="text-xl font-semibold text-[var(--foreground)]">
            Current Directory
          </h3>
        )}
      </div>

      <div className="  space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {directory.map((dir) => (
            <div
              key={dir?._id}
              className="relative p-4  rounded-lg bg-[var(--card)] hover:bg-[var(--surface-variant)] transition-colors duration-200 cursor-pointer"
            >
              <Link to={`/directory/${dir._id}`} className="block">
                <div className="flex items-center gap-3  ">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--foreground)]">
                      {dir?.name}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      items
                    </p>
                  </div>
                </div>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                    <EllipsisVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() =>
                      handleOpenRenameModalOpen("folder", dir._id, dir.name)
                    }
                  >
                    {" "}
                    <Pencil className="w-4 h-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleShowDetails("folder", dir._id)}
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Details
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDeleteDir(dir._id, refetch)}
                  >
                    {" "}
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
      {directory.length === 0 && (
        <section className="flex flex-col items-center justify-center py-20">
          <div className="w-32 h-32 bg-[var(--surface-variant)] rounded-full flex items-center justify-center mb-6">
            <Folder className="w-16 h-16 text-gray-400" />
          </div>
          <p className="text-[var(--muted-foreground)] text-center max-w-md mb-8">
            Your drive have no folder. create new !
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[var(--primary)] hover:bg-[var(--google-blue-hover)] text-[var(--primary-foreground)] px-6 py-3 rounded-xl font-medium shadow-sm transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Folder
            </Button>
          </div>
        </section>
      )}
      {/* files  */}
      <div className="mt-16 space-y-4">
        {allFiles.length > 0 && (
          <h3 className="text-xl font-semibold text-[var(--foreground)]">
            All Files
          </h3>
        )}
        <div className="space-y-2">
          {allFiles &&
            allFiles.map((fileItem) => (
              <div
                key={fileItem._id}
                className="relative p-4 border border-[var(--border)] rounded-lg bg-[var(--card)] hover:bg-[var(--surface-variant)] transition-colors duration-200 cursor-pointer"
              >
                <Link to={`/file/${fileItem._id}`} className="block ">
                  <div className="flex items-center gap-3 ">
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
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                      <EllipsisVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 space-y-1">
                    <DropdownMenuItem
                      onClick={() =>
                        handleOpenRenameModalOpen(
                          "file",
                          fileItem._id,
                          fileItem.name
                        )
                      }
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleShowDetails("file", fileItem._id)}
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Details
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleStarred(fileItem._id, refetch)}
                    >
                      <Star
                        className={`w-4 h-4 mr-2 ${
                          fileItem.isStarred
                            ? "text-gray-500 fill-gray-500"
                            : "text-gray-500"
                        }`}
                      />
                      {fileItem.isStarred
                        ? "Remove from Starred"
                        : "Add to Starred"}
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-48">
                        <DropdownMenuItem
                          onClick={() => setIsShareModalOpen(true)}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCopyLink(fileItem._id)}
                        >
                          <Link2 className="w-4 h-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem
                      onClick={() =>
                        (window.location.href = `http://localhost:3000/api/files/${fileItem.id}?action=download`)
                      }
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => deleteFile(fileItem._id, refetch)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
        </div>
      </div>

      {allFiles.length === 0 && directory.length > 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-32 h-32 bg-[var(--surface-variant)] rounded-full flex items-center justify-center mb-6">
            <File className="w-16 h-16 text-gray-400" />
          </div>
          <p className="text-[var(--muted-foreground)] text-center max-w-md mb-8">
            Your drive is empty. upload files to get started.
          </p>
          {/* Pass the refetch function from Dashboard */}
          <FileUpload parentDirId={parentId} onUploadSuccess={refetch} />
        </div>
      )}

      {isModalOpen && (
        <CreateDirectoryModal
          onClose={() => setIsModalOpen(false)}
          newDirname={newDirname}
          setNewDirname={setNewDirname}
          onCreateDirectory={handleModalCreate}
        />
      )}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          handleGenerate={handleGenerateLink}
        />
      )}
      {isRenameModalOpen && (
        <RenameModal
          renameType={renameType}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          onClose={() => setIsRenameModalOpen(false)}
          onRenameSubmit={handleRename}
        />
      )}
      {showDetailsModal && selectedItem && (
        <DetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          type={detailsType}
          id={selectedItem}
        />
      )}
    </main>
  );
};

export default Dashboard;
