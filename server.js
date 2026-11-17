const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const app = express();
const db = new DatabaseSync(path.join(__dirname, 'cupcakes.db'));
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
db.exec(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, description TEXT, price REAL NOT NULL); CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, customer TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP, total REAL NOT NULL); CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL, unit_price REAL NOT NULL, FOREIGN KEY(order_id) REFERENCES orders(id));`);
if (!db.prepare('SELECT COUNT(*) AS n FROM products').get().n) {
 const insert = db.prepare('INSERT INTO products (name, description, price) VALUES (?, ?, ?)');
 [['Chocolate Belga','Cobertura de chocolate e massa macia',12.5],['Baunilha','Creme de baunilha e confeitos',10],['Red Velvet','Massa vermelha e cobertura cremosa',14],['Doce de Leite','Recheio de doce de leite',13]].forEach(p=>insert.run(...p));
}
app.use(express.json({limit:'50kb'}));
app.use(express.static(path.join(__dirname,'public')));
app.get('/api/products',(_req,res)=>res.json(db.prepare('SELECT * FROM products ORDER BY id').all()));
app.post('/api/orders',(req,res)=>{
 const {customer,items}=req.body || {};
 if(typeof customer!=='string'||!customer.trim()||customer.length>120||!Array.isArray(items)||items.length===0||items.length>30) return res.status(400).json({error:'Informe seu nome e os produtos.'});
 let normalized=[]; let total=0;
 for(const item of items){
  if(!Number.isInteger(item.id)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>50) return res.status(400).json({error:'Item inválido.'});
  const p=db.prepare('SELECT * FROM products WHERE id=?').get(item.id);
  if(!p) return res.status(400).json({error:'Produto não encontrado.'});
  normalized.push({id:p.id,quantity:item.quantity,price:p.price}); total+=p.price*item.quantity;
 }
 const save=()=>{db.exec('BEGIN'); try {const result=db.prepare('INSERT INTO orders (customer,total) VALUES (?,?)').run(customer.trim(),Math.round(total*100)/100); const add=db.prepare('INSERT INTO order_items (order_id,product_id,quantity,unit_price) VALUES (?,?,?,?)'); normalized.forEach(i=>add.run(result.lastInsertRowid,i.id,i.quantity,i.price)); db.exec('COMMIT'); return Number(result.lastInsertRowid); } catch (error) { db.exec('ROLLBACK'); throw error; }};
 res.status(201).json({id:save(),total:Math.round(total*100)/100});
});
app.get('/api/orders',(_req,res)=>res.json(db.prepare('SELECT id,customer,created_at,total FROM orders ORDER BY id DESC').all()));
app.listen(3000,()=>console.log('Aplicativo em http://localhost:3000'));
