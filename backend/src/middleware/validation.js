export function validateUser(req, res, next) {
  const { username, email } = req.body;

  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (username.length > 50) {
    return res.status(400).json({ error: 'Username must be 50 characters or less' });
  }

  if (!email || email.trim().length === 0) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (email.length > 100) {
    return res.status(400).json({ error: 'Email must be 100 characters or less' });
  }

  req.body.username = username.trim();
  req.body.email = email.trim();

  next();
}

export function validateSpot(req, res, next) {
  const { id_user, id_car, location } = req.body;

  if (!id_user || isNaN(parseInt(id_user))) {
    return res.status(400).json({ error: 'Valid user ID is required' });
  }

  if (!id_car || isNaN(parseInt(id_car))) {
    return res.status(400).json({ error: 'Valid car ID is required' });
  }

  if (!location || location.trim().length === 0) {
    return res.status(400).json({ error: 'Location is required' });
  }

  if (location.length > 50) {
    return res.status(400).json({ error: 'Location must be 50 characters or less' });
  }

  req.body.id_user = parseInt(id_user);
  req.body.id_car = parseInt(id_car);
  req.body.location = location.trim();

  next();
}

export function validateCar(req, res, next) {
  const { id_specs, id_trim, id_model, id_brand } = req.body;

  if (!id_specs || isNaN(parseInt(id_specs))) {
    return res.status(400).json({ error: 'Valid specs ID is required' });
  }

  if (!id_trim || isNaN(parseInt(id_trim))) {
    return res.status(400).json({ error: 'Valid trim ID is required' });
  }

  if (!id_model || isNaN(parseInt(id_model))) {
    return res.status(400).json({ error: 'Valid model ID is required' });
  }

  if (!id_brand || isNaN(parseInt(id_brand))) {
    return res.status(400).json({ error: 'Valid brand ID is required' });
  }

  req.body.id_specs = parseInt(id_specs);
  req.body.id_trim = parseInt(id_trim);
  req.body.id_model = parseInt(id_model);
  req.body.id_brand = parseInt(id_brand);

  next();
}

export function validateSpecs(req, res, next) {
  const { price, engine, weight, horse_power } = req.body;

  if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    return res.status(400).json({ error: 'Valid price is required (must be positive)' });
  }

  if (!engine || engine.trim().length === 0) {
    return res.status(400).json({ error: 'Engine type is required' });
  }

  if (engine.length > 50) {
    return res.status(400).json({ error: 'Engine type must be 50 characters or less' });
  }

  if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) < 0) {
    return res.status(400).json({ error: 'Valid weight is required (must be positive)' });
  }

  if (!horse_power || horse_power.trim().length === 0) {
    return res.status(400).json({ error: 'Horse power is required' });
  }

  req.body.price = parseFloat(price);
  req.body.engine = engine.trim();
  req.body.weight = parseFloat(weight);
  req.body.horse_power = horse_power.trim();

  next();
}

export function validateName(req, res, next) {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (name.length > 50) {
    return res.status(400).json({ error: 'Name must be 50 characters or less' });
  }

  req.body.name = name.trim();

  next();
}

export function validateId(req, res, next) {
  const id = req.params.id || req.params.id_user || req.params.id_car;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Invalid ID parameter' });
  }

  next();
}
