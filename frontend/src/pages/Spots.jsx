import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/utils';
import { MapPin, Trash2, Edit, Plus } from 'lucide-react';

export default function Spots() {
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    id_user: '',
    id_car: '',
    location: '',
  });

  useEffect(() => {
    loadSpots();
    loadUsers();
    loadCars();
  }, []);

  useEffect(() => {
    if (filter) {
      setFilteredSpots(
        spots.filter(
          (spot) =>
            spot.location.toLowerCase().includes(filter.toLowerCase()) ||
            spot.brand_name.toLowerCase().includes(filter.toLowerCase()) ||
            spot.username.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredSpots(spots);
    }
  }, [filter, spots]);

  async function loadSpots() {
    try {
      const data = await api.get('/spots');
      setSpots(data);
      setFilteredSpots(data);
    } catch (error) {
      console.error('Failed to load spots:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    try {
      const data = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  async function loadCars() {
    try {
      const data = await api.get('/cars');
      setCars(data);
    } catch (error) {
      console.error('Failed to load cars:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post('/spots', formData);
      setShowForm(false);
      setFormData({ id_user: '', id_car: '', location: '' });
      loadSpots();
    } catch (error) {
      console.error('Failed to create spot:', error);
    }
  }

  async function handleDelete(id_user, id_car) {
    if (confirm('Are you sure you want to delete this spot?')) {
      try {
        await api.delete(`/spots/${id_user}/${id_car}`);
        loadSpots();
      } catch (error) {
        console.error('Failed to delete spot:', error);
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Spots</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Spot
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Spot</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="user">User</Label>
                <select
                  id="user"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.id_user}
                  onChange={(e) => setFormData({ ...formData, id_user: e.target.value })}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id_user} value={user.id_user}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="car">Car</Label>
                <select
                  id="car"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.id_car}
                  onChange={(e) => setFormData({ ...formData, id_car: e.target.value })}
                  required
                >
                  <option value="">Select a car</option>
                  {cars.map((car) => (
                    <option key={car.id_car} value={car.id_car}>
                      {car.brand_name} {car.model_name} - {car.trim_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Spot</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mb-6">
        <Input
          placeholder="Filter by location, brand, or user..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpots.map((spot) => (
          <Card key={`${spot.id_user}-${spot.id_car}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">
                  {spot.brand_name} {spot.model_name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(spot.id_user, spot.id_car)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {spot.location}
                </div>
                <div>
                  <span className="font-medium">Trim:</span> {spot.trim_name}
                </div>
                <div>
                  <span className="font-medium">Spotted by:</span> {spot.username}
                </div>
                <div>
                  <span className="font-medium">Engine:</span> {spot.engine}
                </div>
                <div>
                  <span className="font-medium">Power:</span> {spot.horse_power} HP
                </div>
                <div>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(spot.spoted_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSpots.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No spots found
        </div>
      )}
    </div>
  );
}
