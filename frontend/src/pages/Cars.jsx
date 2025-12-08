import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/utils';
import { Car, DollarSign, Gauge, Weight } from 'lucide-react';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    if (filter) {
      setFilteredCars(
        cars.filter(
          (car) =>
            car.brand_name.toLowerCase().includes(filter.toLowerCase()) ||
            car.model_name.toLowerCase().includes(filter.toLowerCase()) ||
            car.trim_name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredCars(cars);
    }
  }, [filter, cars]);

  async function loadCars() {
    try {
      const data = await api.get('/cars');
      setCars(data);
      setFilteredCars(data);
    } catch (error) {
      console.error('Failed to load cars:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Cars Catalog</h1>

      <div className="mb-6">
        <Input
          placeholder="Filter by brand, model, or trim..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <Card key={car.id_car} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <CardTitle className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                {car.brand_name} {car.model_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Trim:</span> {car.trim_name}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start space-x-2">
                    <DollarSign className="h-4 w-4 mt-0.5 text-green-600" />
                    <div>
                      <div className="text-xs text-muted-foreground">Price</div>
                      <div className="font-semibold">
                        ${Number(car.price).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Gauge className="h-4 w-4 mt-0.5 text-red-600" />
                    <div>
                      <div className="text-xs text-muted-foreground">Power</div>
                      <div className="font-semibold">{car.horse_power} HP</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Weight className="h-4 w-4 mt-0.5 text-blue-600" />
                    <div>
                      <div className="text-xs text-muted-foreground">Weight</div>
                      <div className="font-semibold">{car.weight} kg</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Car className="h-4 w-4 mt-0.5 text-purple-600" />
                    <div>
                      <div className="text-xs text-muted-foreground">Engine</div>
                      <div className="font-semibold">{car.engine}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No cars found
        </div>
      )}
    </div>
  );
}
