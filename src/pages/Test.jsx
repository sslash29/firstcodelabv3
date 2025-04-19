import { useState } from "react";
import supabase from "../../supabase-client";

function Test() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const onSubmit = async function () {
    const { data, error } = await supabase.auth.signInWithPassword({
      name: formData.name,
      password: formData.password,
    });

    if (error) console.error("an error occured", error);

    console.dir(data);
  };

  return (
    <div>
      <form onSubmit={() => onSubmit()}>
        <input
          placeholder="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          placeholder="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}

export default Test;
