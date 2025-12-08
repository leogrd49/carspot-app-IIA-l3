import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/utils';
import { Mail, User, Calendar, MapPin, Car } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [userSpots, setUserSpots] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await api.get('/users');
      setUsers(data);

      const spotsData = {};
      await Promise.all(
        data.map(async (user) => {
          try {
            const spots = await api.get(`/users/${user.id_user}/spots`);
            spotsData[user.id_user] = spots;
          } catch (error) {
            console.error(`Failed to load spots for user ${user.id_user}:`, error);
            spotsData[user.id_user] = [];
          }
        })
      );
      setUserSpots(spotsData);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Users</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {users.map((user) => {
          const spots = userSpots[user.id_user] || [];
          return (
            <Card key={user.id_user}>
              <CardHeader className="bg-gradient-to-r from-secondary to-secondary/80">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {user.username}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm font-medium pt-2">
                    <Car className="h-4 w-4 mr-2 text-primary" />
                    <span>{spots.length} spots</span>
                  </div>

                  {spots.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-2">Recent Spots</h4>
                      <div className="space-y-2">
                        {spots.slice(0, 3).map((spot, index) => (
                          <div
                            key={index}
                            className="text-sm flex items-start justify-between"
                          >
                            <div>
                              <div className="font-medium">
                                {spot.brand_name} {spot.model_name}
                              </div>
                              <div className="text-muted-foreground flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {spot.location}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(spot.spoted_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                        {spots.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{spots.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
