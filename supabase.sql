-- Run this in Supabase Dashboard → SQL Editor → New query → Paste → Run

-- 1. products
create table if not exists products (
  id text primary key,
  name text not null,
  price int not null,
  quantity int not null default 0,
  description text,
  img text,
  created_at timestamp with time zone default now()
);

-- 2. orders
create table if not exists orders (
  id text primary key,
  product_id text references products(id),
  product_name text not null,
  price int not null,
  qty int not null,
  subtotal int,
  shipping_fee int default 0,
  total int not null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  wilaya text not null,
  commune text,
  delivery text not null,
  status text not null default 'قيد الانتظار',
  created_at timestamp with time zone default now()
);

-- 3. shipping rates
create table if not exists shipping_rates (
  wilaya_code text primary key,
  home int not null,
  desk int not null
);

insert into shipping_rates (wilaya_code, home, desk) values
('01',1300,950),('02',850,500),('03',950,600),('04',850,600),('05',850,600),('06',900,500),('07',950,600),('08',1000,700),('09',700,450),('10',800,500),('11',1500,900),('12',1000,550),('13',900,550),('14',900,550),('15',800,500),('16',500,250),('17',950,550),('18',900,500),('19',900,500),('20',900,500),('21',900,500),('22',900,500),('23',850,500),('24',900,500),('25',800,500),('26',800,500),('27',900,500),('28',850,550),('29',900,500),('30',950,650),('31',800,500),('32',1000,650),('33',1500,1000),('34',800,500),('35',700,450),('36',850,500),('37',1500,1000),('38',950,650),('39',950,650),('40',900,500),('41',700,450),('42',700,500),('43',800,500),('44',800,500),('45',1000,650),('46',900,500),('47',950,600),('48',900,500),('49',1300,850),('50',1500,1000),('51',950,500),('52',1000,650),('53',1500,900),('54',1500,900),('55',950,650),('56',1500,1000),('57',950,650),('58',1000,650)
on conflict (wilaya_code) do update set home = excluded.home, desk = excluded.desk;

-- RLS + policies (public for now, tighten later)
alter table products enable row level security;
alter table orders enable row level security;
alter table shipping_rates enable row level security;

drop policy if exists "public all products" on products;
create policy "public all products" on products for all using (true) with check (true);

drop policy if exists "public all orders" on orders;
create policy "public all orders" on orders for all using (true) with check (true);

drop policy if exists "public all shipping" on shipping_rates;
create policy "public all shipping" on shipping_rates for all using (true) with check (true);

-- seed products if empty
insert into products (id, name, price, quantity, description, img) values
('p1','سماعات بلوتوث',3500,25,'صوت نقي مع عزل ضجيج، بطارية 28 ساعة، شحن Type-C.','https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&q=80&auto=format'),
('p2','ساعة ذكية',6900,12,'شاشة AMOLED، تتبع نوم ورياضة، مقاومة 5ATM.','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80&auto=format'),
('p3','شاحن سريع 20W',1800,40,'شحن 50% في 30 دقيقة، حماية من الحرارة.','https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=700&q=80&auto=format')
on conflict (id) do nothing;
