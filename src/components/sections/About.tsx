import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QUALIFICATIONS } from '@/constants';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, getDocFromServer, doc } from 'firebase/firestore';
import { Certificate } from '@/types';
import { GraduationCap, Award, MapPin, Calendar, Eye, FileText, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

export function About() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Initializing Certificate Stream...");
    console.log("Target Project ID:", db.app.options.projectId);
    console.log("Firestore DB ID:", (db as any)._databaseId?.database || "default");
    
    const q = query(collection(db, 'certificates'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`Certificate Snapshot Received: ${snapshot.docs.length} records`);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
      const sortedData = data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setCerts(sortedData);
      setLoadingCerts(false);
    }, (error) => {
      console.error("Certificate Stream Error:", error);
      setConnectionError(`Access Error: ${error.message}`);
      setLoadingCerts(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="about" className="py-10 bg-[var(--color-bg)]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="immersive-card"
          >
            <div className="card-label">About & Education</div>
            <h3 className="text-5xl font-extrabold tracking-tighter mb-8 font-roboto">
              Jimmy Nyasulu
            </h3>
            <p className="text-base font-bold mb-8 font-roboto uppercase tracking-widest text-[var(--color-accent)]">
              Full-Stack Developer & Network Engineer
            </p>
            <div className="space-y-6 text-[var(--color-text-dim)] leading-relaxed text-lg">
              <p>
                Bridging the gap between software and infrastructure. I specialize in 
                building scalable, secure, and efficient digital solutions. 
                Currently pursuing a Master's in Informatics at the University of Malawi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-[var(--color-border)]">
              <div>
                <h4 className="text-3xl font-bold mb-1 text-[var(--color-accent)]">5+</h4>
                <p className="text-xs font-mono uppercase tracking-wider opacity-60">Years Coding</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold mb-1 text-[var(--color-accent)]">10+</h4>
                <p className="text-xs font-mono uppercase tracking-wider opacity-60">Projects Done</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="immersive-card">
              <div className="card-label text-sm">Academic Background</div>
              <div className="space-y-10">
                {QUALIFICATIONS.map((q) => (
                  <div key={q.id} className="relative pl-10 border-l-2 border-[var(--color-border)]">
                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" />
                    <h5 className="font-extrabold text-xl text-[var(--color-text-main)] font-roboto">{q.degree}</h5>
                    <p className="text-[var(--color-text-dim)] flex items-center gap-2 text-sm mt-2 font-mono uppercase tracking-widest font-bold">
                      {q.institution} • {q.period}
                    </p>
                    {q.description && (
                      <p className="text-[var(--color-text-dim)] mt-3 text-base leading-relaxed">
                        {q.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="immersive-card">
              <div className="card-label text-sm uppercase tracking-widest font-bold">Certifications</div>
              <div className="grid gap-6">
                {connectionError ? (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600">
                    <AlertTriangle size={18} />
                    <p className="text-xs font-bold font-mono tracking-tight">{connectionError}</p>
                  </div>
                ) : loadingCerts ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[var(--color-accent)]" /></div>
                ) : certs.length === 0 ? (
                  <p className="text-center py-6 text-sm text-[var(--color-text-dim)] font-mono opacity-40 italic">NO_CERTIFICATES_ON_RECORD</p>
                ) : (
                  certs.map((c) => (
                    <div key={c.id} className="cert-item group flex items-center justify-between p-6">
                      <div>
                        <div className="text-xs uppercase tracking-widest opacity-60 font-mono mb-2 font-bold">{c.issuer}</div>
                        <h5 className="font-extrabold text-lg leading-tight group-hover:text-[var(--color-accent)] transition-colors font-roboto">
                          {c.name}
                        </h5>
                      </div>
                      
                      <div className="flex gap-3">
                        {c.link && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-md border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                            onClick={() => window.open(c.link, '_blank')}
                          >
                            <ShieldCheck size={16} className="mr-2" />
                            VERIFY
                          </Button>
                        )}
                        
                        <Dialog>
                          <DialogTrigger
                            render={
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-md border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
                              >
                                <Eye size={16} className="mr-2" />
                                PREVIEW
                              </Button>
                            }
                          />
                          <DialogContent className="max-w-4xl h-[80vh] bg-[var(--color-surface)] border-[var(--color-border)]">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold font-roboto">{c.name}</DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 w-full h-full mt-4 rounded-lg overflow-hidden border border-[var(--color-border)] bg-black/5">
                              {c.image?.endsWith('.pdf') ? (
                                <iframe 
                                  src={`${c.image}#toolbar=0`} 
                                  className="w-full h-full"
                                  title={c.name}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center p-4">
                                  <img 
                                    src={c.image || 'https://picsum.photos/seed/cert/800/600'} 
                                    alt={c.name}
                                    className="max-w-full max-h-full object-contain shadow-2xl"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
