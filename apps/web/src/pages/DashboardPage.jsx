import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress.jsx';
import { 
  LogOut, LayoutDashboard, Briefcase, CreditCard, LifeBuoy, 
  User as UserIcon, CheckCircle2, Loader2, Clock, Wrench, 
  Search, ShieldCheck, Globe, Smartphone, 
  MessageCircle, UploadCloud, Link as LinkIcon, PackageX
} from 'lucide-react';
import { toast } from 'sonner';
import PaymentHistory from '@/components/PaymentHistory.jsx';

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');
  
  const [freshUser, setFreshUser] = useState(currentUser);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSaving, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (pb.authStore.model?.id) {
          const user = await pb.collection('users').getOne(pb.authStore.model.id, { $autoCancel: false });
          setFreshUser(user);
          await pb.collection('users').authRefresh({ $autoCancel: false });
        }
      } catch (error) {
        console.error("Error fetching updated user data", error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Ensure parsing is safe
  const parsedBusinessData = typeof freshUser?.datos_negocio === 'object' && freshUser?.datos_negocio !== null 
    ? freshUser.datos_negocio 
    : {};

  const [businessData, setBusinessData] = useState({
    business_name: parsedBusinessData.business_name || freshUser?.name || '',
    business_type: parsedBusinessData.business_type || 'Taller General',
    description: parsedBusinessData.description || '',
    phone: parsedBusinessData.phone || '',
    email: parsedBusinessData.email || freshUser?.email || '',
    address: parsedBusinessData.address || '',
    facebook: parsedBusinessData.facebook || '',
    instagram: parsedBusinessData.instagram || '',
    whatsapp: parsedBusinessData.whatsapp || ''
  });

  const [horario, setHorario] = useState(freshUser?.horario || '');
  const [servicios, setServicios] = useState(freshUser?.servicios || '');
  const [colores, setColores] = useState(freshUser?.colores || '#FF6B00');
  
  const [logoFile, setLogoFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState(null);

  const [profileData, setProfileData] = useState({
    name: freshUser?.name || '',
    email: freshUser?.email || ''
  });

  useEffect(() => {
    if (freshUser) {
      const bData = typeof freshUser.datos_negocio === 'object' && freshUser.datos_negocio !== null ? freshUser.datos_negocio : {};
      setBusinessData({
        business_name: bData.business_name || freshUser.name || '',
        business_type: bData.business_type || 'Taller General',
        description: bData.description || '',
        phone: bData.phone || '',
        email: bData.email || freshUser.email || '',
        address: bData.address || '',
        facebook: bData.facebook || '',
        instagram: bData.instagram || '',
        whatsapp: bData.whatsapp || ''
      });
      setHorario(freshUser.horario || '');
      setServicios(freshUser.servicios || '');
      setColores(freshUser.colores || '#FF6B00');
      setProfileData({
        name: freshUser.name || '',
        email: freshUser.email || ''
      });
    }
  }, [freshUser]);

  // Derived states for checklist
  const hasDatosNegocio = useMemo(() => businessData.business_name?.length > 2 && businessData.description?.length > 5, [businessData]);
  const hasPhone = useMemo(() => businessData.phone?.length > 6 || businessData.whatsapp?.length > 6, [businessData]);
  const hasLogo = useMemo(() => !!freshUser?.logo || !!logoFile, [freshUser, logoFile]);
  const hasServicios = useMemo(() => servicios?.length > 5, [servicios]);

  const checklistSteps = [
    { id: 1, title: 'Completar datos del negocio', completed: hasDatosNegocio },
    { id: 2, title: 'Añadir teléfono/WhatsApp', completed: hasPhone },
    { id: 3, title: 'Subir logo', completed: hasLogo },
    { id: 4, title: 'Describir servicios', completed: hasServicios },
  ];
  const completedStepsCount = checklistSteps.filter(s => s.completed).length;
  const progressPercentage = (completedStepsCount / checklistSteps.length) * 100;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('datos_negocio', JSON.stringify(businessData));
      formData.append('horario', horario);
      formData.append('servicios', servicios);
      formData.append('colores', colores);
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      if (imagesFiles && imagesFiles.length > 0) {
        Array.from(imagesFiles).forEach(file => {
          formData.append('business_images', file);
        });
      }

      const updatedUser = await pb.collection('users').update(freshUser.id, formData, { $autoCancel: false });
      setFreshUser(updatedUser);
      setLogoFile(null); // clear staging
      setImagesFiles(null);
      toast.success('Información guardada correctamente');
    } catch (error) {
      console.error('Error saving business data', error);
      toast.error('Error al guardar los datos');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const updatedUser = await pb.collection('users').update(freshUser.id, {
        name: profileData.name
      }, { $autoCancel: false });
      setFreshUser(updatedUser);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error saving profile data', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusConfig = (status) => {
    const s = status || 'pendiente';
    switch (s) {
      case 'pendiente':
        return { icon: Clock, colorClass: 'text-status-pending', bgClass: 'bg-status-pending/10', borderClass: 'border-status-pending/20', label: 'Pendiente', msg: 'Hemos recibido tu pago. Estamos preparando tu sistema.' };
      case 'configuracion':
        return { icon: Wrench, colorClass: 'text-status-dev', bgClass: 'bg-status-dev/10', borderClass: 'border-status-dev/20', label: 'En Configuración', msg: 'Estamos configurando tu plataforma base.' };
      case 'desarrollo':
        return { icon: UploadCloud, colorClass: 'text-status-dev', bgClass: 'bg-status-dev/10', borderClass: 'border-status-dev/20', label: 'En Desarrollo', msg: 'Integrando tus datos y diseñando la web.' };
      case 'revision':
        return { icon: Search, colorClass: 'text-status-review', bgClass: 'bg-status-review/10', borderClass: 'border-status-review/20', label: 'En Revisión', msg: 'Sistema listo. A la espera de tu aprobación final.' };
      case 'activo':
        return { icon: ShieldCheck, colorClass: 'text-status-active', bgClass: 'bg-status-active/10', borderClass: 'border-status-active/20', label: 'Activo', msg: '¡Tu sistema está 100% operativo!' };
      default:
        return { icon: Clock, colorClass: 'text-muted-foreground', bgClass: 'bg-muted', borderClass: 'border-border', label: 'Desconocido', msg: '-' };
    }
  };

  const hasActivePlan = freshUser?.plan && freshUser?.estado === 'activo';

  const menuItems = [
    { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
    ...(hasActivePlan ? [{ id: 'negocio', label: 'Mi Negocio', icon: Briefcase }] : []),
    ...(hasActivePlan ? [{ id: 'pagos', label: 'Pagos', icon: CreditCard }] : []),
    { id: 'soporte', label: 'Soporte', icon: LifeBuoy },
    { id: 'perfil', label: 'Perfil', icon: UserIcon },
  ];

  const currentStatusConfig = getStatusConfig(freshUser?.project_status);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground">
      <Helmet>
        <title>Panel de Control - Digitaliza Coruña</title>
      </Helmet>

      {/* Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 bg-card border-r border-border shrink-0 flex flex-col hidden md:flex z-10">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-white">
              Digitaliza <span className="text-primary">Coruña</span>
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-muted/50 border border-border">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-inner">
              {(freshUser?.name || 'U')[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-foreground truncate">{freshUser?.name || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground truncate">{freshUser?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <Link to="/">
          <span className="text-lg font-bold text-white">Digitaliza <span className="text-primary">Coruña</span></span>
        </Link>
        <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Navigation Tabs */}
      <div className="md:hidden overflow-x-auto border-b border-border bg-card sticky top-[61px] z-10 no-scrollbar shadow-sm">
        <div className="flex px-2 w-max">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === item.id 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto bg-background/50">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {isLoadingUser ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
            </div>
          ) : (
            <>
              {/* TAB: RESUMEN */}
              {activeTab === 'resumen' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <h2 className="text-3xl font-bold text-foreground">Resumen</h2>
                  
                  {hasActivePlan ? (
                    <>
                      {/* Section 1: PROJECT STATUS SECTION */}
                      <div className={`card-elevated p-6 flex items-start sm:items-center gap-5 ${currentStatusConfig.bgClass} ${currentStatusConfig.borderClass}`}>
                        <div className={`p-3 rounded-full shrink-0 ${currentStatusConfig.bgClass} shadow-sm`}>
                          <currentStatusConfig.icon className={`w-8 h-8 ${currentStatusConfig.colorClass}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <h3 className={`text-xl font-bold ${currentStatusConfig.colorClass}`}>
                              Estado del Proyecto: {currentStatusConfig.label}
                            </h3>
                          </div>
                          <p className="text-muted-foreground font-medium">{currentStatusConfig.msg}</p>
                        </div>
                      </div>

                      {/* Section 2: ACTIVATION CHECKLIST */}
                      <div className="card-elevated p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border pb-6">
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">Primeros pasos</h3>
                            <p className="text-sm text-muted-foreground">Completa tu perfil para que podamos avanzar más rápido.</p>
                          </div>
                          <div className="w-full md:w-48 text-right">
                            <div className="flex justify-between text-sm font-bold text-foreground mb-2">
                              <span>Progreso</span>
                              <span className="text-primary">{Math.round(progressPercentage)}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2.5 bg-muted" indicatorClassName="bg-primary" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {checklistSteps.map((step) => (
                            <div key={step.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${step.completed ? 'bg-status-active/5 border-status-active/20' : 'bg-muted/30 border-border'}`}>
                              {step.completed ? (
                                <CheckCircle2 className="w-6 h-6 text-status-active shrink-0" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center shrink-0">
                                  <span className="w-2 h-2 rounded-full bg-transparent"></span>
                                </div>
                              )}
                              <span className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.title}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        {progressPercentage < 100 && (
                          <div className="mt-6">
                            <Button onClick={() => setActiveTab('negocio')} variant="outline" className="w-full sm:w-auto">
                              Completar datos ahora
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Section 4: ACTIVE SYSTEM SECTION */}
                        <div className="card-elevated p-6 md:p-8 flex flex-col">
                          <h3 className="text-xl font-bold text-foreground mb-6">Tu sistema activo</h3>
                          <div className="space-y-5 flex-1">
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg ${freshUser?.project_status === 'activo' ? 'bg-status-active/10 text-status-active' : 'bg-muted text-muted-foreground'}`}>
                                <Globe className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-foreground">Página web profesional</p>
                                <p className="text-sm text-muted-foreground">{freshUser?.project_status === 'activo' ? 'Publicada y optimizada' : 'Pendiente de publicación'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg ${freshUser?.project_status === 'activo' ? 'bg-status-active/10 text-status-active' : 'bg-muted text-muted-foreground'}`}>
                                <MessageCircle className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-foreground">Bot de WhatsApp</p>
                                <p className="text-sm text-muted-foreground">{freshUser?.project_status === 'activo' ? 'Atendiendo 24/7' : 'En configuración'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg ${freshUser?.project_status === 'activo' ? 'bg-status-active/10 text-status-active' : 'bg-muted text-muted-foreground'}`}>
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-foreground">Automatizaciones</p>
                                <p className="text-sm text-muted-foreground">{freshUser?.project_status === 'activo' ? 'Sincronizadas' : 'Esperando integración'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 5: PREVIEW SECTION */}
                        <div className="card-elevated p-6 md:p-8 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Enlaces rápidos</h3>
                            <p className="text-sm text-muted-foreground mb-6">Accede a tus herramientas públicas directamente desde aquí una vez estén activas.</p>
                          </div>
                          
                          <div className="space-y-4">
                            <Button 
                              variant="outline" 
                              className="w-full justify-start h-12 font-medium" 
                              disabled={freshUser?.project_status !== 'activo'}
                            >
                              <LinkIcon className="w-4 h-4 mr-3" /> 
                              Ver mi página web
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start h-12 font-medium"
                              disabled={freshUser?.project_status !== 'activo'}
                            >
                              <Smartphone className="w-4 h-4 mr-3" />
                              Probar bot de WhatsApp
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="card-elevated p-8 md:p-12 flex flex-col items-center text-center max-w-2xl mx-auto mt-8">
                      <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 border border-border">
                        <PackageX className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Aún no tienes ningún plan activo</h3>
                      <p className="text-muted-foreground mb-8 text-lg max-w-md">
                        Tu cuenta está creada correctamente, pero todavía no has contratado ningún servicio.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 shadow-lg shadow-primary/20">
                          <Link to="/services">Ver planes</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: MI NEGOCIO (Section 3 enhancements) */}
              {activeTab === 'negocio' && hasActivePlan && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-3xl font-bold text-foreground mb-2">Mi Negocio</h2>
                  <p className="text-muted-foreground mb-8">Información esencial para configurar tu presencia digital.</p>
                  
                  <form onSubmit={handleBusinessSubmit} className="space-y-8 card-elevated p-6 sm:p-8">
                    
                    {/* Basic Info */}
                    <div className="space-y-6 pb-6 border-b border-border">
                      <h3 className="text-lg font-bold text-primary flex items-center gap-2"><Briefcase className="w-5 h-5"/> Información Básica</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="form-label" htmlFor="business_name">Nombre del negocio</label>
                          <input 
                            id="business_name" type="text" value={businessData.business_name}
                            onChange={(e) => setBusinessData({...businessData, business_name: e.target.value})}
                            className="form-input-field" placeholder="Taller Ejemplo"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label" htmlFor="business_type">Sector</label>
                          <select 
                            id="business_type" value={businessData.business_type}
                            onChange={(e) => setBusinessData({...businessData, business_type: e.target.value})}
                            className="form-input-field"
                          >
                            <option value="Taller General">Taller Mecánico General</option>
                            <option value="Chapa y Pintura">Chapa y Pintura</option>
                            <option value="Neumáticos">Neumáticos y Servicio Rápido</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="form-label" htmlFor="description">Descripción breve</label>
                        <textarea 
                          id="description" rows="3" value={businessData.description}
                          onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                          className="form-input-field min-h-[80px] py-3 resize-none"
                          placeholder="Describe brevemente a qué se dedica tu negocio..."
                        ></textarea>
                      </div>
                    </div>

                    {/* Services & Schedule (NEW) */}
                    <div className="space-y-6 pb-6 border-b border-border">
                      <h3 className="text-lg font-bold text-primary flex items-center gap-2"><Clock className="w-5 h-5"/> Oferta y Horarios</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="form-label" htmlFor="servicios">Servicios Principales (separados por coma)</label>
                          <textarea 
                            id="servicios" rows="3" value={servicios}
                            onChange={(e) => setServicios(e.target.value)}
                            className="form-input-field min-h-[80px] py-3 resize-none"
                            placeholder="Ej. Cambio de aceite, Revisiones pre-ITV, Neumáticos..."
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="form-label" htmlFor="horario">Horario de apertura</label>
                          <textarea 
                            id="horario" rows="3" value={horario}
                            onChange={(e) => setHorario(e.target.value)}
                            className="form-input-field min-h-[80px] py-3 resize-none"
                            placeholder="Ej. Lunes a Viernes: 9:00 - 14:00 y 16:00 - 19:00"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Social */}
                    <div className="space-y-6 pb-6 border-b border-border">
                      <h3 className="text-lg font-bold text-primary flex items-center gap-2"><Smartphone className="w-5 h-5"/> Contacto y Redes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="form-label" htmlFor="phone">Teléfono de atención</label>
                          <input 
                            id="phone" type="tel" value={businessData.phone}
                            onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                            className="form-input-field" placeholder="600 000 000"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label" htmlFor="whatsapp">WhatsApp para el Bot</label>
                          <input 
                            id="whatsapp" type="tel" value={businessData.whatsapp}
                            onChange={(e) => setBusinessData({...businessData, whatsapp: e.target.value})}
                            className="form-input-field" placeholder="600 000 000"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="form-label" htmlFor="address">Dirección completa</label>
                          <input 
                            id="address" type="text" value={businessData.address}
                            onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                            className="form-input-field" placeholder="Calle Ejemplo, 1, 15001 A Coruña"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label" htmlFor="instagram">Perfil Instagram</label>
                          <input 
                            id="instagram" type="text" value={businessData.instagram}
                            onChange={(e) => setBusinessData({...businessData, instagram: e.target.value})}
                            className="form-input-field" placeholder="@tu_taller"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="form-label" htmlFor="facebook">Perfil Facebook</label>
                          <input 
                            id="facebook" type="text" value={businessData.facebook}
                            onChange={(e) => setBusinessData({...businessData, facebook: e.target.value})}
                            className="form-input-field" placeholder="Nombre en Facebook"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Branding (NEW) */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-primary flex items-center gap-2"><UploadCloud className="w-5 h-5"/> Branding e Imágenes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="form-label" htmlFor="colores">Color corporativo principal</label>
                          <div className="flex items-center gap-3">
                            <input 
                              id="colores" type="color" value={colores}
                              onChange={(e) => setColores(e.target.value)}
                              className="h-12 w-16 p-1 cursor-pointer bg-input border border-border rounded-md"
                            />
                            <span className="text-sm text-muted-foreground font-mono">{colores}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="form-label">Logo (1 imagen)</label>
                          <input 
                            type="file" accept="image/*"
                            onChange={(e) => setLogoFile(e.target.files[0])}
                            className="form-input-field p-2.5 text-muted-foreground file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          />
                          {freshUser?.logo && !logoFile && <p className="text-xs text-status-active">Logo actual guardado.</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="form-label">Imágenes del negocio (Hasta 10)</label>
                          <input 
                            type="file" accept="image/*" multiple
                            onChange={(e) => setImagesFiles(e.target.files)}
                            className="form-input-field p-2.5 text-muted-foreground file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          />
                          {freshUser?.business_images?.length > 0 && !imagesFiles && (
                            <p className="text-xs text-status-active">{freshUser.business_images.length} imágenes guardadas actualmente.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-border flex justify-end">
                      <Button 
                        type="submit"
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 w-full sm:w-auto shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                      >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        Guardar información
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: PAGOS (Section 7 enhancements in PaymentHistory component) */}
              {activeTab === 'pagos' && hasActivePlan && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <h2 className="text-3xl font-bold text-foreground">Facturación y Pagos</h2>
                  
                  <div className="card-elevated overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                      <h3 className="text-xl font-bold text-foreground">Historial completo</h3>
                    </div>
                    <PaymentHistory />
                  </div>
                </div>
              )}

              {/* TAB: SOPORTE (Section 6 enhancements) */}
              {activeTab === 'soporte' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <h2 className="text-3xl font-bold text-foreground">Centro de Soporte</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                      <div className="card-elevated p-6 bg-primary/5 border-primary/20">
                        <h3 className="font-bold text-foreground text-lg mb-2">Asistencia Rápida</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Para consultas urgentes, escríbenos directamente por WhatsApp.
                        </p>
                        <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-600/20">
                          <a href="https://wa.me/34634218480" target="_blank" rel="noreferrer">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Contactar por WhatsApp
                          </a>
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-3 font-medium">
                          Respondemos en menos de 24h
                        </p>
                      </div>

                      <div className="card-elevated p-6">
                        <h3 className="font-bold text-foreground mb-4">Otros canales</h3>
                        <div className="space-y-4 text-sm text-muted-foreground">
                          <p><strong className="text-foreground block">Email de soporte:</strong> soporte@digitalizacoruna.es</p>
                          <p><strong className="text-foreground block">Horario de atención:</strong> Lunes a Viernes<br/>9:00h - 18:00h</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <form className="card-elevated p-6 md:p-8 space-y-6">
                        <h3 className="font-bold text-xl text-foreground border-b border-border pb-4">Abrir un ticket</h3>
                        
                        <div className="space-y-2">
                          <label className="form-label">Asunto principal</label>
                          <input type="text" className="form-input-field" placeholder="Ej. Modificar texto de la web, duda sobre cobros..." />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="form-label">Mensaje detallado</label>
                          <textarea className="form-input-field min-h-[180px] py-3 resize-none" placeholder="Explícanos cómo podemos ayudarte..."></textarea>
                        </div>

                        <div className="flex justify-end">
                          <Button type="button" onClick={() => toast.success('Ticket enviado. Te responderemos pronto.')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8">
                            Enviar solicitud
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PERFIL */}
              {activeTab === 'perfil' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <h2 className="text-3xl font-bold text-foreground">Perfil de Usuario</h2>
                  
                  <form onSubmit={handleProfileSubmit} className="card-elevated p-6 sm:p-8 max-w-2xl space-y-6">
                    <div className="space-y-2">
                      <label className="form-label">Nombre de la cuenta</label>
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="form-input-field" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="form-label">Email de acceso (No modificable)</label>
                      <input 
                        type="email" 
                        value={profileData.email}
                        disabled
                        className="form-input-field disabled:opacity-50 disabled:bg-muted" 
                      />
                    </div>

                    <div className="pt-6 border-t border-border flex flex-wrap gap-4 items-center justify-between">
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                        Modificar contraseña
                      </Link>
                      <Button 
                        type="submit"
                        disabled={isSaving}
                        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold px-8 h-11"
                      >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        Actualizar perfil
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}