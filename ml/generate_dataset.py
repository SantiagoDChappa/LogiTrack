import random
import pandas as pd
from faker import Faker

fake = Faker('es_AR')
Faker.seed(42)
random.seed(42)

PROVINCIAS = [
    'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
    'Cordoba', 'Corrientes', 'Entre Rios', 'Formosa', 'Jujuy',
    'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquen',
    'Rio Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
    'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucuman',
]

DISTANCIA_DESDE_BA = {
    'Buenos Aires': 50,   'CABA': 0,          'Catamarca': 1050,
    'Chaco': 1000,        'Chubut': 1400,      'Cordoba': 700,
    'Corrientes': 1000,   'Entre Rios': 450,   'Formosa': 1150,
    'Jujuy': 1550,        'La Pampa': 550,     'La Rioja': 1100,
    'Mendoza': 1050,      'Misiones': 1250,    'Neuquen': 1150,
    'Rio Negro': 1200,    'Salta': 1450,       'San Juan': 1100,
    'San Luis': 800,      'Santa Cruz': 2100,  'Santa Fe': 500,
    'Santiago del Estero': 1050, 'Tierra del Fuego': 3000, 'Tucuman': 1250,
}

def calculate_distance(origin, destination):
    base  = abs(DISTANCIA_DESDE_BA[origin] - DISTANCIA_DESDE_BA[destination])
    base  = max(base, 100)
    noise = random.randint(-80, 80)
    return max(50, base + noise)

def calculate_delay(distance, weight, quantity, ship_type, day, month):
    probability = 0.20

    if distance > 1000:    probability += 0.25
    if weight > 20:        probability += 0.15
    if quantity > 10:      probability += 0.10
    if ship_type == 1:     probability += 0.10
    if day in (0, 4):      probability += 0.10
    if month in (11, 12):  probability += 0.20

    probability = min(probability, 1.0)
    return 1 if random.random() < probability else 0

def calculate_delivery_days(distance, ship_type, delayed):
    if distance <= 200:
        base_days = 1
    elif distance <= 500:
        base_days = 2
    elif distance <= 1000:
        base_days = 4
    else:
        base_days = 7

    if ship_type == 0:
        base_days = max(1, base_days - 1)

    if delayed == 1:
        base_days += random.randint(1, 5)

    return base_days

def generate_dataset(n_rows=20000):
    rows = []
    for i in range(1, n_rows + 1):
        origin      = random.choice(PROVINCIAS)
        destination = random.choice(PROVINCIAS)
        distance    = calculate_distance(origin, destination)
        weight      = round(random.uniform(0.5, 50.0), 2)
        quantity    = random.randint(1, 20)
        ship_type   = random.choice([0, 1])
        day         = random.randint(0, 6)
        month       = random.randint(1, 12)
        delayed     = calculate_delay(distance, weight, quantity, ship_type, day, month)
        delivery_days = calculate_delivery_days(distance, ship_type, delayed)

        rows.append({
            'tracking_id':          f'ENV-{str(i).zfill(4)}',
            'sender':               fake.name(),
            'recipient':            fake.name(),
            'origin_province':      origin,
            'destination_province': destination,
            'distance_km':          distance,
            'weight_kg':            weight,
            'package_quantity':     quantity,
            'ship_type':            ship_type,
            'day_of_week':          day,
            'month':                month,
            'delayed':              delayed,
            'delivery_days':        delivery_days,
        })

    return pd.DataFrame(rows)

if __name__ == '__main__':
    import os
    os.makedirs('dataset', exist_ok=True)

    df = generate_dataset()
    df.to_csv('dataset/shipments.csv', index=False, encoding='utf-8')

    print(f'Dataset generated: dataset/shipments.csv')
    print(f'  Total rows    : {len(df)}')
    print(f'  Delayed       : {df["delayed"].sum()} ({df["delayed"].mean()*100:.1f}%)')
    print(f'  On time       : {(df["delayed"] == 0).sum()} ({(1 - df["delayed"].mean())*100:.1f}%)')
    print(f'  Avg days      : {df["delivery_days"].mean():.1f}')
    print()
    print(df.head(5).to_string(index=False))
