import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, CheckCircle2, Copy, Loader2, Mail, MapPin, Send, TriangleAlert } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { EMAIL, FORMSUBMIT_URL, GITHUB_URL, GMAIL_COMPOSE_URL, LINKEDIN_URL } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import { GithubIcon, LinkedinIcon } from '../components/icons'
import { FadeIn, Magnetic, SectionHeading, TiltCard, btnGhost, btnPrimary, card } from '../components/ui/motion'
import { Signature } from '../components/Signature'

type Status = 'idle' | 'sending' | 'success' | 'error'
type Field = 'name' | 'email' | 'message'
type ErrorKey = keyof ReturnType<typeof useI18n>['t']['contact']['form']['errors']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: Record<Field, string>): Partial<Record<Field, ErrorKey>> {
  const e: Partial<Record<Field, ErrorKey>> = {}
  if (!v.name.trim()) e.name = 'nameRequired'
  else if (v.name.trim().length < 2) e.name = 'nameShort'
  if (!v.email.trim()) e.email = 'emailRequired'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'emailInvalid'
  if (!v.message.trim()) e.message = 'messageRequired'
  else if (v.message.trim().length < 10) e.message = 'messageShort'
  return e
}

export function Contact() {
  const { t } = useI18n()
  const c = t.contact
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [honey, setHoney] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)

  const errors = validate(values)
  const showErr = (f: Field) => (touched[f] ? errors[f] : undefined)

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(c.form.subject)}&body=${encodeURIComponent(
    `${values.message}\n\n— ${values.name} (${values.email})`,
  )}`

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (Object.keys(errors).length) {
      const first = (['name', 'email', 'message'] as Field[]).find((f) => errors[f])
      if (first) document.getElementById(`cf-${first}`)?.focus()
      return
    }
    // Campo trampa: si un bot lo llena, fingimos éxito y no enviamos nada
    if (honey) {
      setStatus('success')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          _subject: c.form.subject,
          _template: 'table',
          _captcha: 'false',
          _replyto: values.email.trim(),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { success?: string | boolean }
      if (!res.ok || String(data.success) === 'false') throw new Error('send failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = EMAIL
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const reset = () => {
    setValues({ name: '', email: '', message: '' })
    setTouched({})
    setStatus('idle')
  }

  const input =
    'w-full rounded-2xl border bg-bg/60 px-4 py-3.5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_18%,transparent)]'

  return (
    <section id="contacto" aria-labelledby="contact-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="contact-title" kicker={c.kicker} title={c.title} accent={c.titleAccent} />
        <Signature width={190} duration={1.6} className="-mt-6 mb-10 max-w-full text-primary-text md:-mt-8 md:mb-12" />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          {/* Izquierda */}
          <div>
            <FadeIn>
              <p className="max-w-md text-lg leading-relaxed text-muted">{c.intro}</p>
            </FadeIn>
            <ol className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {c.steps.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="flex items-center gap-3"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-primary font-display font-extrabold text-on-primary">{i + 1}</span>
                  <span className="font-semibold">{s}</span>
                  {i < c.steps.length - 1 && <span className="hidden h-px w-8 bg-line-strong sm:block" aria-hidden="true" />}
                </motion.li>
              ))}
            </ol>

            <dl className="mt-10 space-y-4">
              <div className="flex items-center gap-4">
                <dt className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary-text">
                  <Mail size={20} aria-hidden="true" />
                  <span className="sr-only">{c.emailLabel}</span>
                </dt>
                <dd className="min-w-0">
                  <span className="block font-mono text-xs text-muted uppercase">{c.emailLabel}</span>
                  <a href={`mailto:${EMAIL}`} className="block font-semibold break-all hover:text-primary-text">
                    {EMAIL}
                  </a>
                </dd>
              </div>
              <div className="flex items-center gap-4">
                <dt className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary-text">
                  <MapPin size={20} aria-hidden="true" />
                  <span className="sr-only">{c.locationLabel}</span>
                </dt>
                <dd>
                  <span className="block font-mono text-xs text-muted uppercase">{c.locationLabel}</span>
                  <span className="font-semibold">{c.location}</span>
                </dd>
              </div>
            </dl>

            <div className={`mt-8 grid gap-3 ${LINKEDIN_URL ? 'sm:grid-cols-2' : ''}`}>
              <TiltCard max={8} innerClassName="rounded-3xl">
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={`${card} group flex items-center gap-4 p-5`}>
                  <span className="grid size-12 place-items-center rounded-2xl bg-ink text-bg">
                    <GithubIcon size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-extrabold">GitHub</span>
                    <span className="block text-sm text-muted">{c.githubText}</span>
                  </span>
                  <ArrowUpRight size={18} className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-text" aria-hidden="true" />
                  <span className="sr-only">{t.projects.newTab}</span>
                </a>
              </TiltCard>
              {LINKEDIN_URL && (
                <TiltCard max={8} innerClassName="rounded-3xl">
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={`${card} group flex items-center gap-4 p-5`}>
                    <span className="grid size-12 place-items-center rounded-2xl bg-[#0a66c2] text-white">
                      <LinkedinIcon size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display font-extrabold">LinkedIn</span>
                      <span className="block text-sm text-muted">{c.linkedinText}</span>
                    </span>
                    <ArrowUpRight size={18} className="text-muted group-hover:text-primary-text" aria-hidden="true" />
                    <span className="sr-only">{t.projects.newTab}</span>
                  </a>
                </TiltCard>
              )}
            </div>
          </div>

          {/* Formulario */}
          <FadeIn delay={0.1}>
            <div className={`${card} relative overflow-hidden p-6 sm:p-8`}>
              <AnimatePresence mode="wait" initial={false}>
                {status === 'success' ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[420px] flex-col items-center justify-center text-center"
                    role="status"
                  >
                    <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
                      <CheckCircle2 size={64} className="text-primary-text" aria-hidden="true" />
                    </motion.span>
                    <h3 className="mt-5 font-display text-3xl font-extrabold">{c.form.successTitle}</h3>
                    <p className="mt-2 max-w-sm text-muted">{c.form.successText}</p>
                    <button type="button" onClick={reset} className={`${btnGhost} mt-6`}>
                      {c.form.sendAnother}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-labelledby="form-title">
                    <h3 id="form-title" className="font-display text-2xl font-extrabold">
                      {c.form.title}
                    </h3>
                    <div className="mt-6 space-y-5">
                      {(['name', 'email', 'message'] as Field[]).map((f) => {
                        const err = showErr(f)
                        const common = {
                          id: `cf-${f}`,
                          name: f,
                          value: values[f],
                          placeholder: c.form[`${f}Ph` as 'namePh'],
                          'aria-invalid': !!err,
                          'aria-describedby': err ? `cf-${f}-err` : undefined,
                          required: true,
                          onChange: (e: { target: { value: string } }) => setValues((v) => ({ ...v, [f]: e.target.value })),
                          onBlur: () => setTouched((tc) => ({ ...tc, [f]: true })),
                          className: `${input} ${err ? 'border-primary' : 'border-line-strong'}`,
                        }
                        return (
                          <div key={f}>
                            <label htmlFor={`cf-${f}`} className="mb-1.5 block text-sm font-semibold">
                              {c.form[f]}
                            </label>
                            {f === 'message' ? (
                              <textarea {...common} rows={5} className={`${common.className} resize-y`} />
                            ) : (
                              <input {...common} type={f === 'email' ? 'email' : 'text'} autoComplete={f === 'email' ? 'email' : 'name'} />
                            )}
                            <AnimatePresence>
                              {err && (
                                <motion.p
                                  id={`cf-${f}-err`}
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-primary-text"
                                >
                                  <TriangleAlert size={14} aria-hidden="true" /> {c.form.errors[err]}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                      {/* Campo trampa contra spam (oculto para personas) */}
                      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                        <label htmlFor="cf-website">{c.form.honeypot}</label>
                        <input id="cf-website" name="_honey" type="text" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
                      </div>
                    </div>

                    {status === 'error' && (
                      <div role="alert" className="mt-5 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-sm">
                        <p className="font-semibold text-primary-text">{c.form.errorTitle}</p>
                        <p className="mt-1">{c.form.errorText}</p>
                        <a href={mailto} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-primary-text underline underline-offset-4">
                          <Mail size={14} aria-hidden="true" /> {c.form.openMail}
                        </a>
                      </div>
                    )}

                    <Magnetic strength={0.15} className="mt-6 w-full">
                      <button type="submit" disabled={status === 'sending'} className={`${btnPrimary} w-full disabled:opacity-70`}>
                        {status === 'sending' ? (
                          <>
                            <Loader2 size={17} className="animate-spin" aria-hidden="true" /> {c.form.sending}
                          </>
                        ) : (
                          <>
                            <Send size={16} aria-hidden="true" /> {status === 'error' ? c.form.retry : c.form.submit}
                          </>
                        )}
                      </button>
                    </Magnetic>
                    <p className="sr-only" aria-live="polite">
                      {status === 'sending' ? c.form.sending : ''}
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-5 flex flex-col items-start gap-3 rounded-3xl border border-dashed border-line-strong p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium">{c.alt}</p>
              <div className="flex flex-wrap gap-2 sm:shrink-0 sm:flex-nowrap">
                <a href={GMAIL_COMPOSE_URL} target="_blank" rel="noopener noreferrer" className={`${btnGhost} px-4 py-2.5`}>
                  <Mail size={15} aria-hidden="true" /> {c.gmail}
                  <span className="sr-only"> {t.projects.newTab}</span>
                </a>
                <button type="button" onClick={copyEmail} className={`${btnGhost} px-4 py-2.5`}>
                  {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                  {copied ? c.copied : c.copy}
                </button>
              </div>
              <p className="sr-only" aria-live="polite">
                {copied ? c.copied : ''}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
