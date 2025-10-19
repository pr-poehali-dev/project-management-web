import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Project {
  id: string;
  name: string;
  apiKey: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  integrations: number;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', apiKey: '' });
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Production API',
      apiKey: 'pk_prod_abc123***',
      status: 'active',
      createdAt: '2024-01-15',
      integrations: 5
    },
    {
      id: '2',
      name: 'Development API',
      apiKey: 'pk_dev_xyz789***',
      status: 'active',
      createdAt: '2024-02-20',
      integrations: 3
    },
    {
      id: '3',
      name: 'Test Environment',
      apiKey: 'pk_test_def456***',
      status: 'pending',
      createdAt: '2024-03-10',
      integrations: 1
    }
  ]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    if (newProject.name && newProject.apiKey) {
      const project: Project = {
        id: String(projects.length + 1),
        name: newProject.name,
        apiKey: newProject.apiKey + '***',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        integrations: 0
      };
      setProjects([...projects, project]);
      setNewProject({ name: '', apiKey: '' });
      setIsDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="Briefcase" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Панель управления</h1>
                <p className="text-sm text-muted-foreground">Управление проектами и интеграциями</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm font-normal">
                {projects.length} {projects.length === 1 ? 'проект' : 'проектов'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">Проекты</h2>
            <p className="text-muted-foreground">Создавайте и управляйте вашими проектами</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Plus" size={18} />
                Создать проект
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый проект</DialogTitle>
                <DialogDescription>
                  Создайте новый проект и настройте интеграции
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название проекта</Label>
                  <Input
                    id="name"
                    placeholder="Например, Production API"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API ключ</Label>
                  <Input
                    id="apiKey"
                    placeholder="pk_prod_..."
                    value={newProject.apiKey}
                    onChange={(e) => setNewProject({ ...newProject, apiKey: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ключ будет зашифрован после сохранения
                  </p>
                </div>
                <Button onClick={handleCreateProject} className="w-full">
                  Создать проект
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск проектов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {project.status === 'active' ? 'Активен' : project.status === 'pending' ? 'В ожидании' : 'Неактивен'}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        Создан {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Plug" size={14} />
                        {project.integrations} интеграций
                      </span>
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Icon name="MoreVertical" size={18} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                      <Icon name="Key" size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">API ключ</p>
                      <code className="text-xs text-muted-foreground font-mono">{project.apiKey}</code>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Icon name="Copy" size={14} />
                    Копировать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Icon name="Inbox" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">Проекты не найдены</h3>
            <p className="text-muted-foreground mb-4">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
