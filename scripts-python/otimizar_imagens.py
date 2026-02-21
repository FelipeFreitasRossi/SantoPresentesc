import os
from PIL import Image
import sys

def otimizar_imagens():
    """Redimensiona e otimiza imagens para o app"""
    
    # Pastas (ajuste conforme sua estrutura)
    pasta_origem = "../imagens_originais"
    pasta_destino = "../imagens_otimizadas"
    
    # Criar pasta destino se não existir
    if not os.path.exists(pasta_destino):
        os.makedirs(pasta_destino)
    
    # Extensões suportadas
    extensoes = ('.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG')
    
    # Listar arquivos
    arquivos = [f for f in os.listdir(pasta_origem) 
                if f.lower().endswith(extensoes)]
    
    if not arquivos:
        print(f"⚠️ Nenhuma imagem encontrada em {pasta_origem}")
        return
    
    print(f"📸 Encontradas {len(arquivos)} imagens")
    
    for i, arquivo in enumerate(arquivos, 1):
        try:
            # Abrir imagem
            caminho_origem = os.path.join(pasta_origem, arquivo)
            img = Image.open(caminho_origem)
            
            # Redimensionar mantendo proporção
            img.thumbnail((800, 800), Image.Resampling.LANCZOS)
            
            # Criar nome do arquivo de saída
            nome_base = os.path.splitext(arquivo)[0]
            caminho_destino = os.path.join(pasta_destino, f"{nome_base}.jpg")
            
            # Salvar com qualidade otimizada
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            img.save(caminho_destino, 'JPEG', quality=85, optimize=True)
            
            # Mostrar progresso
            tamanho_original = os.path.getsize(caminho_origem) / 1024
            tamanho_novo = os.path.getsize(caminho_destino) / 1024
            reducao = (1 - tamanho_novo/tamanho_original) * 100
            
            print(f"  {i}. {arquivo[:20]:<20} "
                  f"{tamanho_original:>6.0f}KB → "
                  f"{tamanho_novo:>6.0f}KB "
                  f"({reducao:.0f}% menor)")
            
        except Exception as e:
            print(f"  ❌ Erro em {arquivo}: {e}")
    
    print(f"\n✅ Imagens otimizadas salvas em: {pasta_destino}")

def gerar_lista_para_cloudinary():
    """Gera uma lista pronta para copiar/colar no Cloudinary"""
    
    pasta_destino = "../imagens_otimizadas"
    
    if not os.path.exists(pasta_destino):
        print("⚠️ Pasta de imagens otimizadas não encontrada")
        return
    
    imagens = [f for f in os.listdir(pasta_destino) 
               if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    if not imagens:
        print("⚠️ Nenhuma imagem encontrada")
        return
    
    print("\n📋 URLs para copiar (já no formato do produto):")
    print("-" * 60)
    
    for img in sorted(imagens):
        nome_sem_ext = os.path.splitext(img)[0]
        print(f'"{nome_sem_ext}": "https://res.cloudinary.com/SEU_CLOUD/image/upload/v1/{nome_sem_ext}.jpg",')
    
    print("-" * 60)
    print("💡 Substitua 'SEU_CLOUD' pelo seu cloud name do Cloudinary")

if __name__ == "__main__":
    print("🎨 OTIMIZADOR DE IMAGENS")
    print("=" * 50)
    
    if not os.path.exists("../imagens_originais"):
        print("❌ Pasta 'imagens_originais' não encontrada!")
        print("💡 Crie a pasta e coloque suas imagens lá.")
        sys.exit(1)
    
    otimizar_imagens()
    
    print("\n" + "=" * 50)
    gerar_lista_para_cloudinary()