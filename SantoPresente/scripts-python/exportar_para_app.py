import sqlite3
import json
from datetime import datetime

def exportar_para_typescript():
    """Exporta produtos do SQLite para o formato TypeScript do app"""
    
    conn = sqlite3.connect('produtos.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM produtos ORDER BY id')
    produtos = cursor.fetchall()
    
    if not produtos:
        print("⚠️ Nenhum produto para exportar!")
        return
    
    # Cabeçalho do arquivo
    ts_content = """import { Produto } from '../types';

export const produtos: Produto[] = [
"""
    
    for p in produtos:
        # p[0]=id, p[1]=nome, p[2]=descricao, p[3]=preco, p[4]=categoria
        # p[5]=estampa, p[6]=capuz, p[7]=tamanhos, p[8]=imagemUrl
        
        # Converter tamanhos de string para array
        tamanhos_array = p[7].split(',') if p[7] else ["P", "M", "G", "GG"]
        
        produto_ts = f"""  {{
    id: {p[0]},
    nome: "{p[1]}",
    descricao: "{p[2]}",
    preco: {p[3]},
    categoria: "{p[4]}",
    estampa: {str(p[5]).lower()},
    {f'capuz: {str(p[6]).lower()},' if p[4] == 'moletom' else ''}
    tamanhos: {json.dumps(tamanhos_array)},
    imagemUrl: "{p[8] if p[8] else 'https://via.placeholder.com/400x400'}"
  }},
"""
        ts_content += produto_ts
    
    ts_content += "];\n"
    
    # Caminho para o arquivo no projeto Expo
    # Ajuste este caminho conforme sua estrutura
    caminho_destino = r"C:\Users\User\Desktop\SantoPresente\app-expo\app\data\produtos.ts"    
    try:
        with open(caminho_destino, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        print(f"✅ Arquivo exportado para: {caminho_destino}")
        print(f"📦 Total de produtos: {len(produtos)}")
    except Exception as e:
        print(f"❌ Erro ao salvar: {e}")
        print("💡 Dica: Verifique se o caminho está correto")
    
    conn.close()

def exportar_para_json():
    """Exporta também para JSON (útil para backup)"""
    
    conn = sqlite3.connect('produtos.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM produtos ORDER BY id')
    produtos = cursor.fetchall()
    
    produtos_json = []
    for p in produtos:
        produtos_json.append({
            'id': p[0],
            'nome': p[1],
            'descricao': p[2],
            'preco': p[3],
            'categoria': p[4],
            'estampa': bool(p[5]),
            'capuz': bool(p[6]) if p[4] == 'moletom' else None,
            'tamanhos': p[7].split(',') if p[7] else [],
            'imagemUrl': p[8]
        })
    
    # Salvar backup JSON
    with open('backup_produtos.json', 'w', encoding='utf-8') as f:
        json.dump(produtos_json, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Backup JSON salvo: backup_produtos.json")
    conn.close()

if __name__ == "__main__":
    print("📤 Exportando produtos para o app...")
    exportar_para_typescript()
    exportar_para_json()