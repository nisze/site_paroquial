# 📁 ESTRUTURA DE ASSETS - PROJETO PAROQUIAL

## 🎯 **ESTRATÉGIA DE GERENCIAMENTO DE MÍDIA**

### **✅ O QUE FICA NO ANGULAR (src/assets/)**
```
src/assets/
├── images/
│   ├── paroquia/           # Fotos da igreja, eventos fixos
│   │   ├── igreja-exterior.jpg
│   │   ├── interior-missa.jpg
│   │   └── padre-principal.jpg
│   ├── santos/             # Imagens de santos
│   │   ├── nossa-senhora-aparecida.jpg
│   │   └── sao-pedro.jpg
│   └── eventos/            # Eventos sazonais
│       ├── natal-2024.jpg
│       └── festa-padroeira.jpg
├── videos/
│   ├── hero-video.mp4      # Vídeo principal (máx 5MB)
│   └── apresentacao.mp4    # Vídeos curtos institucionais
├── icons/
│   ├── cruz.svg
│   └── biblia.svg
└── README-Assets.md        # Este arquivo
```

### **❌ O QUE NÃO FICA NO ANGULAR**
- ❌ Vídeos grandes (>10MB)
- ❌ Galerias de fotos dinâmicas
- ❌ Upload de usuários
- ❌ Conteúdo que muda frequentemente

## 🗄️ **O QUE FICA NO BANCO DE DADOS**

### **📊 Apenas METADADOS e REFERÊNCIAS:**
```typescript
interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  imagemUrl: string;        // ← URL/caminho da imagem
  videoUrl?: string;        // ← URL do vídeo (se houver)
  dataPublicacao: Date;
  autor: string;
}

interface Evento {
  id: number;
  nome: string;
  data: Date;
  descricao: string;
  imagensCapa: string[];    // ← Array de URLs das imagens
  galeriaUrls: string[];    // ← URLs da galeria completa
}
```

## 🌐 **ESTRATÉGIA HÍBRIDA RECOMENDADA**

### **1. Assets Estáticos (Angular)**
- Logo da paróquia
- Imagens de santos (fixas)
- Ícones da interface
- Vídeos pequenos de apresentação

### **2. CDN/Cloud Storage**
- Vídeos grandes de eventos
- Galerias de fotos extensas
- Conteúdo de alta resolução

### **3. Upload Dinâmico (Future)**
- Fotos de eventos novos
- Vídeos de homilias
- Documentos paroquiais

## 💡 **IMPLEMENTAÇÃO NO CÓDIGO**

### **Componente de Notícia:**
```typescript
@Component({
  selector: 'app-noticia-card',
  template: `
    <div class="card">
      <!-- Imagem estática -->
      <img [ngSrc]="getImageUrl(noticia.imagemUrl)" 
           [alt]="noticia.titulo"
           width="400" height="300">
      
      <!-- Vídeo dinâmico -->
      <video *ngIf="noticia.videoUrl" controls>
        <source [src]="noticia.videoUrl" type="video/mp4">
      </video>
      
      <div class="card-body">
        <h5>{{ noticia.titulo }}</h5>
        <p>{{ noticia.conteudo }}</p>
      </div>
    </div>
  `
})
export class NoticiaCardComponent {
  @Input() noticia!: Noticia;
  
  getImageUrl(path: string): string {
    // Se começar com 'assets/', é local
    if (path.startsWith('assets/')) {
      return path;
    }
    // Caso contrário, é URL externa
    return path;
  }
}
```

### **Service para Mídia:**
```typescript
@Injectable()
export class MidiaService {
  private baseAssetsUrl = 'assets/images/';
  
  // Imagens estáticas
  getImagemParoquia(nome: string): string {
    return `${this.baseAssetsUrl}paroquia/${nome}`;
  }
  
  getImagemSanto(nome: string): string {
    return `${this.baseAssetsUrl}santos/${nome}`;
  }
  
  // URLs dinâmicas do backend
  processarUrlImagem(url: string): string {
    if (url.startsWith('http')) {
      return url; // URL externa
    }
    return `${this.baseAssetsUrl}${url}`; // Path local
  }
}
```

## 🚀 **CONFIGURAÇÃO NO ANGULAR.JSON**

Já configurado corretamente:
```json
"assets": [
  {
    "glob": "**/*",
    "input": "public"
  }
]
```

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### **✅ Já Configurado:**
- [x] Estrutura de pastas assets
- [x] Configuração no angular.json
- [x] NgOptimizedImage disponível

### **🔄 Próximos Passos:**
- [ ] Criar service de mídia
- [ ] Implementar componentes de imagem
- [ ] Configurar lazy loading para imagens
- [ ] Integrar com backend para URLs dinâmicas

## 🔍 **EXEMPLO PRÁTICO**

Para seu projeto paroquial:

1. **Logo e imagens fixas** → `src/assets/images/`
2. **Vídeos do hero** → `src/assets/videos/` (pequenos)
3. **Vídeos de eventos** → CDN externa (YouTube, Vimeo)
4. **Galerias dinâmicas** → Backend + Cloud Storage
5. **Metadados** → PostgreSQL/MySQL via Spring Boot

Isso otimiza performance e mantém o bundle do Angular enxuto! 🎯