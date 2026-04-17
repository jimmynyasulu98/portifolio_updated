import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Linkedin, Github, Twitter, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export function Contact() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const path = 'contact_messages';
      await addDoc(collection(db, path), {
        ...values,
        date: new Date().toLocaleString(), // Keep legacy date string for UI
        timestamp: serverTimestamp(),
      });
      
      setShowSuccessModal(true);
      form.reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'contact_messages');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-[var(--color-bg)]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
              05 // Contact
            </h2>
            <h3 className="text-5xl font-bold tracking-tighter mb-8">
              Direct Access
            </h3>
            <p className="text-lg text-[var(--color-text-dim)] mb-12 max-w-md font-mono text-sm leading-relaxed">
              // Initializing communication protocol... <br />
              // Waiting for user input...
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] transition-all">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 mb-1">Email</p>
                  <p className="text-lg font-bold">Jimmynyasulu98@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] transition-all">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 mb-1">Location</p>
                  <p className="text-lg font-bold">Lilongwe, Malawi</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="immersive-card"
          >
            <div className="card-label">Transmission Form</div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-widest opacity-60">Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="NAME" 
                            className={cn(
                              "h-12 rounded-md border-[var(--color-border)] bg-[var(--color-bg)] focus:border-[var(--color-accent)] font-mono text-xs transition-all",
                              fieldState.error && "border-destructive focus:border-destructive",
                              !fieldState.error && field.value && "border-green-500/50 focus:border-green-500"
                            )} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-mono" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-widest opacity-60">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="EMAIL" 
                            className={cn(
                              "h-12 rounded-md border-[var(--color-border)] bg-[var(--color-bg)] focus:border-[var(--color-accent)] font-mono text-xs transition-all",
                              fieldState.error && "border-destructive focus:border-destructive",
                              !fieldState.error && field.value && "border-green-500/50 focus:border-green-500"
                            )} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-mono" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-mono uppercase tracking-widest opacity-60">Subject</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="SUBJECT" 
                          className={cn(
                            "h-12 rounded-md border-[var(--color-border)] bg-[var(--color-bg)] focus:border-[var(--color-accent)] font-mono text-xs transition-all",
                            fieldState.error && "border-destructive focus:border-destructive",
                            !fieldState.error && field.value && "border-green-500/50 focus:border-green-500"
                          )} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-mono" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-mono uppercase tracking-widest opacity-60">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="MESSAGE_BODY" 
                          className={cn(
                            "min-h-[120px] rounded-md border-[var(--color-border)] bg-[var(--color-bg)] focus:border-[var(--color-accent)] resize-none font-mono text-xs transition-all",
                            fieldState.error && "border-destructive focus:border-destructive",
                            !fieldState.error && field.value && "border-green-500/50 focus:border-green-500"
                          )} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-mono" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={!form.formState.isValid || isSubmitting}
                  className="w-full h-12 rounded-md text-xs font-mono font-bold uppercase tracking-[0.2em] bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent)]/90 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      TRANSMITTING...
                      <Loader2 className="ml-2 w-3 h-3 animate-spin" />
                    </>
                  ) : (
                    <>
                      EXECUTE_SEND
                      <Send className="ml-2 w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md bg-[var(--color-surface)] border-[var(--color-border)] p-0 overflow-hidden">
          <div className="h-2 bg-[var(--color-accent)] w-full" />
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-[var(--color-accent-dim)] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-[var(--color-accent)]" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold font-roboto mb-2 text-[var(--color-text-main)]">
                TRANSMISSION_SUCCESS
              </DialogTitle>
              <DialogDescription className="text-[var(--color-text-dim)] font-mono text-sm uppercase tracking-widest">
                Protocol: Secure // Status: Delivered
              </DialogDescription>
            </DialogHeader>
            <div className="mt-8 space-y-4">
              <p className="text-[var(--color-text-dim)] leading-relaxed">
                Your message has been successfully encrypted and transmitted to the central server. 
                Jimmy will review your request and respond via the provided communication channel.
              </p>
              <div className="pt-6">
                <Button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full h-12 rounded-md font-mono font-bold uppercase tracking-widest bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent)]/90"
                >
                  CLOSE_CONNECTION
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
