-- Habilitar RLS (Row Level Security)
ALTER DATABASE postgres SET "app.current_tenant_id" = '';

-- Tabela de tenants (organizações/lojas)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  business_type VARCHAR(50) NOT NULL CHECK (business_type IN ('confeitaria', 'padaria', 'doceria', 'salgaderia', 'lanchonete', 'outro')),
  owner_name VARCHAR(255) NOT NULL,
  owner_email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  logo_url TEXT,
  plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'premium')),
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Tabela de usuários do tenant
CREATE TABLE IF NOT EXISTS tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('owner', 'admin', 'manager', 'employee')),
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(tenant_id, user_id)
);

-- Função para obter o tenant atual
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_tenant_id', true), '')::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para configurar o tenant atual
CREATE OR REPLACE FUNCTION set_current_tenant_id(tenant_uuid UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', tenant_uuid::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tabela de categorias com multi-tenancy
CREATE TABLE IF NOT EXISTS tenant_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  default_markup DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de ingredientes com multi-tenancy
CREATE TABLE IF NOT EXISTS tenant_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(20) NOT NULL, -- kg, g, l, ml, un, etc
  cost_per_unit DECIMAL(10,2) NOT NULL,
  supplier VARCHAR(255),
  min_stock DECIMAL(10,2) DEFAULT 0,
  current_stock DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos/itens com multi-tenancy
CREATE TABLE IF NOT EXISTS tenant_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES tenant_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  selling_price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  preparation_time INTEGER, -- em minutos
  is_available BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de receitas (ingredientes dos produtos)
CREATE TABLE IF NOT EXISTS tenant_product_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES tenant_products(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES tenant_ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(10,4) NOT NULL, -- quantidade do ingrediente necessária
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes com multi-tenancy
CREATE TABLE IF NOT EXISTS tenant_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos com multi-tenancy
CREATE TABLE IF NOT EXISTS tenant_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES tenant_customers(id) ON DELETE SET NULL,
  order_number VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS tenant_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES tenant_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES tenant_products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_order_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tenants
CREATE POLICY tenant_isolation_policy ON tenant_categories
  USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_policy ON tenant_ingredients
  USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_policy ON tenant_products
  USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_policy ON tenant_product_ingredients
  USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_policy ON tenant_customers
  USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_policy ON tenant_orders
  USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_policy ON tenant_order_items
  USING (tenant_id = current_tenant_id());

-- Política para tenant_users (usuários podem ver apenas seu próprio tenant)
CREATE POLICY tenant_users_policy ON tenant_users
  USING (tenant_id = current_tenant_id() OR user_id = auth.uid());

-- Política para tenants (usuários podem ver apenas seu próprio tenant)
CREATE POLICY tenants_policy ON tenants
  USING (id = current_tenant_id() OR id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

-- Índices para performance
CREATE INDEX idx_tenant_categories_tenant_id ON tenant_categories(tenant_id);
CREATE INDEX idx_tenant_ingredients_tenant_id ON tenant_ingredients(tenant_id);
CREATE INDEX idx_tenant_products_tenant_id ON tenant_products(tenant_id);
CREATE INDEX idx_tenant_customers_tenant_id ON tenant_customers(tenant_id);
CREATE INDEX idx_tenant_orders_tenant_id ON tenant_orders(tenant_id);
CREATE INDEX idx_tenant_order_items_tenant_id ON tenant_order_items(tenant_id);
CREATE INDEX idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_user_id ON tenant_users(user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em tabelas relevantes
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_categories_updated_at BEFORE UPDATE ON tenant_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_ingredients_updated_at BEFORE UPDATE ON tenant_ingredients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_products_updated_at BEFORE UPDATE ON tenant_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_customers_updated_at BEFORE UPDATE ON tenant_customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_orders_updated_at BEFORE UPDATE ON tenant_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
