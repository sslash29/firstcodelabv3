import { useState, useContext } from "react";
import supabase from "../../supabase-client";
import { GroupContext } from "../context/GroupContext";

function AddHomework() {
  const { groupList } = useContext(GroupContext); // Get groups from context
  const [homeworkName, setHomeworkName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Upload PDF & Save Homework
  const handleAddHomework = async () => {
    if (!homeworkName || !pdfFile || !deadline || !selectedGroup) {
      alert("Please fill in all fields.");
      return;
    }

    const filePath = `homework/${selectedGroup}/${Date.now()}_${pdfFile.name}`;

    // Upload PDF to Supabase Storage
    const { data, error } = await supabase.storage
      .from("homeworks")
      .upload(filePath, pdfFile);

    if (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload PDF!");
      return;
    }

    // Get the public URL of the uploaded file
    const { data: fileUrl } = supabase.storage
      .from("homeworks")
      .getPublicUrl(filePath);

    // Save homework details in the database
    const { error: dbError } = await supabase.from("Homeworks").insert([
      {
        name: homeworkName,
        file_url: fileUrl.publicUrl,
        deadline,
        group: selectedGroup,
      },
    ]);

    if (dbError) {
      console.error("Error saving homework:", dbError);
      alert("Failed to save homework!");
      return;
    }

    alert("Homework added successfully!");
    setHomeworkName("");
    setPdfFile(null);
    setDeadline("");
    setSelectedGroup("");
  };

  return (
    <div className="p-4 border rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Add Homework</h2>

      {/* Homework Name Input */}
      <input
        type="text"
        placeholder="Homework Name"
        value={homeworkName}
        onChange={(e) => setHomeworkName(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      {/* File Upload */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="border p-2 rounded w-full mb-3"
      />

      {/* Deadline Picker */}
      <label>Deadline</label>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      {/* Group Selection */}
      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      >
        <option value="">Select Group</option>
        {groupList.map((group, index) => (
          <option key={index} value={group}>
            {group}
          </option>
        ))}
      </select>

      {/* Submit Button */}
      <button
        onClick={handleAddHomework}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        Add Homework
      </button>
    </div>
  );
}

export default AddHomework;
