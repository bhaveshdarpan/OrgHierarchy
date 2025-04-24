import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Tree from "react-d3-tree";
import { toast } from "sonner";
import { Toaster } from "sonner";

export interface TreeNode {
  name: string;
  children: TreeNode[];
}

const API = "https://org-hierarchy-backend.onrender.com/api";

async function fetchHierarchyData() {
  const res = await fetch(`${API}/toJson`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

async function postData(url: string, body: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.text();
}

async function deleteData(url: string) {
  const res = await fetch(url, {
    method: "DELETE",
  });
  return res.text();
}

interface HireOwnerFormProps {
  ownerId: string;
  setOwnerId: (val: string) => void;
  onHireOwner: () => void;
}
function HireOwnerForm({ ownerId, setOwnerId, onHireOwner }: HireOwnerFormProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl">Hire Owner</h2>
      <Input placeholder="Owner ID" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} />
      <Button onClick={onHireOwner}>Hire Owner</Button>
    </div>
  );
}

interface HireEmployeeFormProps {
  employeeId: string;
  bossId: string;
  setEmployeeId: (val: string) => void;
  setBossId: (val: string) => void;
  onHireEmployee: () => void;
  onFireEmployee: () => void;
}
function HireEmployeeForm({ employeeId, bossId, setEmployeeId, setBossId, onHireEmployee, onFireEmployee }: HireEmployeeFormProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl">Hire / Fire Employee</h2>
      <Input placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
      <Input placeholder="Boss ID (for hiring)" value={bossId} onChange={(e) => setBossId(e.target.value)} />
      <div className="flex gap-2">
        <Button onClick={onHireEmployee}>Hire Employee</Button>
        <Button variant="destructive" onClick={onFireEmployee}>
          Fire Employee
        </Button>
      </div>
    </div>
  );
}

interface HierarchyControlsProps {
  onFetchHierarchy: () => void;
  onResetOrg: () => void;
}
function HierarchyControls({ onFetchHierarchy, onResetOrg }: HierarchyControlsProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl">View Hierarchy</h2>
      <div className="flex gap-2">
        <Button onClick={onFetchHierarchy}>Get Hierarchy</Button>
        <Button variant="destructive" onClick={onResetOrg}>
          Reset Organization
        </Button>
      </div>
    </div>
  );
}

interface TreeVisualizationProps {
  hierarchy: TreeNode | null;
}
function TreeVisualization({ hierarchy }: TreeVisualizationProps) {
  if (!hierarchy) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>No hierarchy data available</p>
      </div>
    );
  }
  return (
    <Tree
      data={hierarchy}
      orientation="vertical"
      translate={{ x: 200, y: 50 }}
      zoomable
      scaleExtent={{ min: 0.5, max: 2 }}
      separation={{ siblings: 1.5, nonSiblings: 2 }}
      pathClassFunc={() => "stroke-current text-gray-400"}
      nodeSize={{ x: 200, y: 100 }}
    />
  );
}

// Main component
function App() {
  const [hierarchy, setHierarchy] = useState<TreeNode | null>(null);
  const [employeeId, setEmployeeId] = useState("");
  const [bossId, setBossId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [output, setOutput] = useState("");

  const handleHierarchy = async () => {
    try {
      const data = await fetchHierarchyData();
      setHierarchy(data);
    } catch (err) {
      setOutput("Error fetching hierarchy: " + err);
      toast.error("Failed to fetch hierarchy");
    }
  };

  const handleHireOwner = async () => {
    try {
      const msg = await postData(`${API}/hireOwner`, { id: Number(ownerId) });
      setOutput(msg);
      toast.success(msg);
      handleHierarchy();
    } catch (err) {
      setOutput("Error: " + err);
      toast.error("Failed to hire owner");
    }
  };

  const handleHireEmployee = async () => {
    try {
      const msg = await postData(`${API}/hireEmployee`, {
        id: Number(employeeId),
        bossId: Number(bossId),
      });
      setOutput(msg);
      toast.success(msg);
      handleHierarchy();
    } catch (err) {
      setOutput("Error: " + err);
      toast.error("Failed to hire employee");
    }
  };

  const handleFireEmployee = async () => {
    try {
      const msg = await deleteData(`${API}/fireEmployee/${employeeId}`);
      setOutput(msg);
      toast.success(msg);
      handleHierarchy();
    } catch (err) {
      setOutput("Error: " + err);
      toast.error("Failed to fire employee");
    }
  };

  const handleResetOrg = async () => {
    try {
      const msg = await postData(`${API}/reset`, {});
      setOutput(msg);
      toast.success(msg);
      setHierarchy(null);
    } catch (err) {
      setOutput("Error: " + err);
      toast.error("Failed to reset organization");
    }
  };

  return (
    <main className="p-6 flex">
      {/* LEFT: Controls */}
      <div className="w-1/2 pr-6 space-y-6">
        <h1 className="text-2xl font-bold">Organizational Manager</h1>
        <HireOwnerForm ownerId={ownerId} setOwnerId={setOwnerId} onHireOwner={handleHireOwner} />
        <HireEmployeeForm
          employeeId={employeeId}
          bossId={bossId}
          setEmployeeId={setEmployeeId}
          setBossId={setBossId}
          onHireEmployee={handleHireEmployee}
          onFireEmployee={handleFireEmployee}
        />
        <HierarchyControls onFetchHierarchy={handleHierarchy} onResetOrg={handleResetOrg} />
        <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">{output}</pre>
      </div>

      {/* RIGHT: Tree Visualization */}
      <div className="w-1/2 flex flex-col">
        <div className="flex-1 border rounded bg-white shadow p-2 overflow-auto">
          <TreeVisualization hierarchy={hierarchy} />
        </div>
      </div>
      <Toaster />
    </main>
  );
}

export default App;
