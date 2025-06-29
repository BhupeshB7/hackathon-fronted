import axios from "axios";
import { toast } from "sonner";

// Fetch directory content
export const fetchDirectory = async (parentId) => {
  try {
    const res = await axios.get(
      `https://hackathon-backend-chi-two.vercel.app/api/directory/${parentId || ""}`,
      { withCredentials: true }
    );

    return res.data;
  } catch (err) {
    toast.error("Failed to load directory");
    throw err;
  }
};

// Create new directory with prompt
export const handleCreateDirectory = async (parentId, dirname, refetch) => {
  if (!dirname || !dirname.trim()) {
    toast.error("Folder name is required");
    return false;
  }

  try {
    const res = await axios.post(
      `https://hackathon-backend-chi-two.vercel.app/api/directory/create/${parentId || ""}`,
      null,
      {
        headers: { dirname },
        withCredentials: true,
      }
    );
    if (res.status === 201) {
      toast.success("Folder created successfully");
      if (refetch) refetch();
      return true;
    }
  } catch (err) {
    toast.error(err.response.data.message || "Failed to create folder");
    return false;
  }
};

export const handleRenameDirOrFile = async (type, id, value, refetch) => {
  if (!value || !value.trim()) {
    toast.error(`Please enter a valid ${type} name`);
    return false;
  }
  try {
    const url =
      type === "file"
        ? `https://hackathon-backend-chi-two.vercel.app/api/files/rename/${id}`
        : `https://hackathon-backend-chi-two.vercel.app/api/directory/rename/${id}`;
    const data =
      type === "file" ? { newFileName: value } : { newDirName: value };
    const res = await axios.patch(url, data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      toast.success(`  ${type} renamed successfully`);
      if (refetch) refetch();
      return true;
    }
  } catch (error) {
    toast.error(error.response.data.message || "Failed to rename");

    return false;
  }
};

export const handleDeleteDir = async (id, refetch) => {
  const result = window.confirm(`Are you sure you want to delete this folder?`);
  if (!result) return;
  try {
    const res = await axios.delete(
      `https://hackathon-backend-chi-two.vercel.app/api/directory/${id}`,
      {
        withCredentials: true,
      }
    );
    if (res.status === 200) {
      toast.success(`  Folder deleted successfully`);
      if (refetch) refetch();
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteFile = async (fileId, refetch) => {
  const result = window.confirm("Are you sure you want to delete this file?");
  if (!result) return;
  try {
    const res = await axios.delete(
      `https://hackathon-backend-chi-two.vercel.app/api/files/${fileId}`,
      {
        withCredentials: true,
      }
    );
    if (res.status === 200) {
      if (refetch) refetch();
      toast.success(`  File deleted successfully`);
      return true;
    }
  } catch (error) {
    toast.error(error.response.data.message || "Failed to delete");

    return false;
  }
};

export const allTrashFiles = async (page = 1, limit = 5, sortBy = "recent") => {
  try {
    const res = await axios.get(
      `https://hackathon-backend-chi-two.vercel.app/api/trash?page=${page}&limit=${limit}&sortBy=${sortBy}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to load trash");
    throw error;
  }
};

export const deleteTrashFile = async (fileId) => {
  try {
    const res = await axios.delete(
      `https://hackathon-backend-chi-two.vercel.app/api/trash/delete/${fileId}`,
      { withCredentials: true }
    );
   
    if (res.status === 200) {
      toast.success("File deleted successfully");
    }
    return res.data
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete file");
  }
};
export const getFileAnalytics = async () => {
  try {
    const res = await axios.get("https://hackathon-backend-chi-two.vercel.app/api/files/analytics", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to load analytics");
    throw error;
  }
};

export const handleStarred = async (fileId, refetch) => {
  try {
    const res = await axios.patch(
      `https://hackathon-backend-chi-two.vercel.app/api/files/starred/${fileId}`,
      null,
      {
        withCredentials: true,
      }
    );
    if (res.status === 200) {
      toast.success(res.data.message);
      if (refetch) refetch();
      return true;
    }
  } catch (error) {
    toast.error(error.response.data.message || "Failed to star file");

    return false;
  }
};

function copyToClipboard(text) {
  const url = `http://localhost:5173/view/${text}`;
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(url);
  }
  toast.error("Copying to clipboard failed");
  return false;
}
export const handleCopyLink = async (fileId) => {
  try {
    const res = await axios.post(
      `https://hackathon-backend-chi-two.vercel.app/api/files/copy-link/${fileId}`,
      null,
      { withCredentials: true }
    );
    if (res.status === 200) {
      copyToClipboard(res.data.link);
      toast.success("Link copied to clipboard");
      return true;
    }
  } catch (error) {
    toast.error(error.response.data.message || "Failed to copy link");
    throw error;
  }
};
