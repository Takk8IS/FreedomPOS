"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  MoreVertical,
  DollarSign,
  Percent,
  Clock,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import * as semver from 'semver';

interface Module {
  id: number;
  name: string;
  icon: string;
  description: string;
  status: 'active' | 'inactive';
  version: string;
  lastUpdated: string;
  license: string;
  dependencies: string[];
  settings?: Record<string, any>;
}

// Sample modules data
const modules = [
  {
    id: 1,
    name: "Point of Sale",
    icon: "CreditCard",
    description: "Process sales and manage transactions",
    status: "active",
    version: "1.2.0",
    lastUpdated: "2025-04-01T14:30:00",
    license: "Licensed",
    dependencies: ["core", "inventory"]
  },
  {
    id: 2,
    name: "Inventory Management",
    icon: "Package",
    description: "Track and manage product inventory",
    status: "active",
    version: "1.1.5",
    lastUpdated: "2025-03-28T10:15:00",
    license: "Licensed",
    dependencies: ["core"]
  }
] as Module[];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "inactive":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

export default function ModulesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Module>>({});
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { t } = useI18n();
  const { toast } = useToast();

  const filteredModules = modules.filter((module) => {
    const matchesSearch = 
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || module.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (module: Module) => {
    setSelectedModule(module);
    setEditForm(module);
    setShowEditDialog(true);
  };

  const handleDelete = (module: Module) => {
    setSelectedModule(module);
    setShowDeleteDialog(true);
  };

  const handleAdd = () => {
    setEditForm({
      status: 'inactive',
      version: '1.0.0',
      dependencies: []
    });
    setShowAddDialog(true);
  };

  const handleCheckUpdates = async () => {
    try {
      setLoading(true);
      // In a real app, this would check for updates from a server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: "All modules are up to date"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check for updates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      
      if (!semver.valid(editForm.version)) {
        throw new Error('Invalid version number');
      }

      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Module updated successfully"
      });
      
      setShowEditDialog(false);
      setSelectedModule(null);
      setEditForm({});
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update module",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdd = async () => {
    try {
      setLoading(true);

      if (!editForm.name || !editForm.version || !semver.valid(editForm.version)) {
        throw new Error('Please fill in all required fields with valid values');
      }
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Module added successfully"
      });
      
      setShowAddDialog(false);
      setEditForm({});
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add module",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Module deleted successfully"
      });
      
      setShowDeleteDialog(false);
      setSelectedModule(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete module",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const ModuleForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Module Name</Label>
        <Input
          id="name"
          value={editForm.name || ''}
          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter module name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={editForm.description || ''}
          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter module description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={editForm.version || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, version: e.target.value }))}
            placeholder="e.g., 1.0.0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="license">License</Label>
          <Input
            id="license"
            value={editForm.license || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, license: e.target.value }))}
            placeholder="Enter license type"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Dependencies</Label>
        <Select
          value={editForm.dependencies?.join(',')}
          onValueChange={(value) => setEditForm(prev => ({
            ...prev,
            dependencies: value ? value.split(',') : []
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select dependencies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="core">Core</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="customers">Customers</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label>Status</Label>
        <Switch
          checked={editForm.status === 'active'}
          onCheckedChange={(checked) => 
            setEditForm(prev => ({ 
              ...prev, 
              status: checked ? 'active' : 'inactive' 
            }))
          }
        />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Modules</h1>
          <p className="text-muted-foreground">Manage system modules and features</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCheckUpdates} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Check Updates
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </div>
      </header>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search modules..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredModules.map((module) => (
          <Card key={module.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{module.name}</CardTitle>
              <div className="flex items-center gap-2">
                {getStatusIcon(module.status)}
                <span className="text-xs text-muted-foreground capitalize">{module.status}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{module.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Version</p>
                    <p className="text-sm font-medium">{module.version}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">
                      {new Date(module.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{module.license}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEdit(module)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(module)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
            <DialogDescription>
              Make changes to the module configuration
            </DialogDescription>
          </DialogHeader>
          <ModuleForm isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Module</DialogTitle>
            <DialogDescription>
              Configure a new system module
            </DialogDescription>
          </DialogHeader>
          <ModuleForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdd} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Module
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the module
              {selectedModule && ` "${selectedModule.name}"`} and remove it from the system.
              Any dependent modules may stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}