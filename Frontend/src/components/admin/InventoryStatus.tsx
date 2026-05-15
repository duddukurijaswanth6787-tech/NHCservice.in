import { useState, useEffect } from "react";
import { Package, Plus, RefreshCw, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const INGREDIENT_LIST = [
    "Pumpkin Seeds",
    "Flax Seeds",
    "Sunflower Seeds",
    "Sesame seeds",
    "Dry Dates Powder",
    "Jaggery Powder",
    "Pure Ghee",
    "Almond",
    "Dry Coconut Powder",
    "Black Sesame Seeds"
];

export function InventoryStatus() {
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        console.log("InventoryStatus mounted, activeTab is inventory");
    }, []);

    // Form state
    const [formData, setFormData] = useState({
        name: INGREDIENT_LIST[0],
        phase: "Phase-1",
        stockGrams: "",
        minThreshold: "500"
    });

    const API_BASE = '/api';

    const fetchIngredients = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/ingredients`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await res.json();
            if (data.success) setIngredients(data.data);
        } catch (error) {
            toast.error("Failed to fetch inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    const handleAddIngredient = async (e: React.FormEvent) => {
        e.preventDefault();
        const grams = parseFloat(formData.stockGrams);
        console.log("Submitting ingredient update:", { ...formData, grams });
        try {
            const res = await fetch(`${API_BASE}/ingredients/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Success: ${grams}g added to ${formData.name}`);
                setIsAdding(false);
                setFormData({ name: INGREDIENT_LIST[0], phase: "Phase-1", stockGrams: "", minThreshold: "500" });
                fetchIngredients();
            } else {
                toast.error(data.message || "Failed to save ingredient");
            }
        } catch (error) {
            toast.error("Error saving ingredient");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`${API_BASE}/ingredients/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            if (res.ok) {
                toast.success("Ingredient removed");
                fetchIngredients();
            }
        } catch (error) {
            toast.error("Error deleting");
        }
    };

    const PhaseSection = ({ title, phase }: { title: string, phase: string }) => {
        const filtered = ingredients.filter(ing => ing.phase === phase);

        return (
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Package className="w-5 h-5 text-pink-500" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filtered.length === 0 ? (
                            <p className="text-sm text-gray-400 italic py-4">No ingredients listed for this phase.</p>
                        ) : (
                            filtered.map(ing => (
                                <div key={ing._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 border border-gray-100 group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-800">{ing.name}</span>
                                            {ing.stockGrams < (ing.minThreshold || 500) ? (
                                                <Badge variant="destructive" className="h-4 text-[10px] px-1 animate-pulse">
                                                    <AlertTriangle className="w-2.5 h-2.5 mr-1" /> Low Stock
                                                </Badge>
                                            ) : (
                                                <Badge className="h-4 text-[10px] px-1 bg-green-500 hover:bg-green-600 border-none">
                                                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> OK
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Usage: 30g per laddu (order qty)
                                        </div>
                                    </div>

                                    <div className="text-right flex items-center gap-4">
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{ing.stockGrams}g</div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">In Stock</div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(ing._id)}
                                            className="h-8 w-8 p-0 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Inventory Status</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage raw materials (30g per laddu calculation)</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchIngredients} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button size="sm" onClick={() => setIsAdding(!isAdding)} className="bg-pink-500 hover:bg-pink-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Ingredient
                    </Button>
                </div>
            </div>

            {isAdding && (
                <Card className="border-2 border-pink-100 shadow-xl bg-pink-50/30">
                    <CardHeader>
                        <CardTitle className="text-sm">Add / Update Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddIngredient} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="name">Ingredient Name</Label>
                                <select
                                    id="name"
                                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-white text-sm"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                >
                                    {INGREDIENT_LIST.map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phase">Phase</Label>
                                <select
                                    id="phase"
                                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-white text-sm"
                                    value={formData.phase}
                                    onChange={e => setFormData({ ...formData, phase: e.target.value })}
                                >
                                    <option value="Phase-1">Phase-1</option>
                                    <option value="Phase-2">Phase-2</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Add Grams (+)</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    placeholder="1000"
                                    className="bg-white"
                                    value={formData.stockGrams}
                                    onChange={e => setFormData({ ...formData, stockGrams: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="bg-pink-500 hover:bg-pink-600">Save</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PhaseSection title="Phase-1 (Follicular)" phase="Phase-1" />
                <PhaseSection title="Phase-2 (Luteal)" phase="Phase-2" />
            </div>

            <Card className="border-none shadow-md bg-white/50">
                <CardContent className="p-4 flex items-center gap-3 text-sm text-gray-500">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Note: Stock check is calculated at 30 grams per laddu based on the total quantity in each order.</span>
                </CardContent>
            </Card>
        </div>
    );
}
