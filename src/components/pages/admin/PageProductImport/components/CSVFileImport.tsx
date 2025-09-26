import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;

    console.log("uploadFile to", url);
    console.log("File to upload:", file.name, file.type);

    const { data } = await axios.get(url, {
      params: {
        name: file.name,
        contentType: file.type || "text/csv",
      },
    });

    const uploadUrl: string = data.url;
    const requiredHeaders: Record<string, string> = data.requiredHeaders || {};

    console.log("Uploading to:", uploadUrl, "headers:", requiredHeaders);

    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        ...(requiredHeaders || {}),
      },
      body: file,
    });

    console.log("Result:", res.status, res.statusText);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Upload failed: ${res.status} ${res.statusText} ${text}`);
    }

    setFile(undefined);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
