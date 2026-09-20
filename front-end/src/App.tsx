import {
  BadgeDollarSign,
  Beef,
  Bird,
  CircleAlert,
  CircleCheck,
  Clock3,
  HeartPulse,
  LoaderCircle,
  PackageOpen,
  PawPrint,
  PiggyBank,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  Warehouse,
  Wheat,
  X,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useDeferredValue, useEffect, useRef, useState } from 'react'
import { checkAnimalsHealth, createAnimal, getAnimals, sellAnimal } from './api'
import './App.css'
import ProducoesWorkspace from './ProducoesWorkspace'
import type { Animal, AnimalOrigin, CreateAnimalPayload } from './types'

type ServiceId = 'animais' | 'producao' | 'financeiro'
type HealthStatus = 'checking' | 'online' | 'offline'

const serviceTabs = [
  { id: 'animais' as const, label: 'Animais', icon: Beef },
  { id: 'producao' as const, label: 'Produção', icon: Wheat },
  { id: 'financeiro' as const, label: 'Financeiro', icon: BadgeDollarSign },
]

const animalIcons: Record<string, typeof Beef> = {
  vaca: Beef,
  galinha: Bird,
  ovelha: PawPrint,
  porco: PiggyBank,
  pato: Bird,
  boi: Beef,
  cavalo: PackageOpen,
  jumento: LoaderCircle,
}

const formatCurrency = (value: string | number | null) => {
  if (value === null) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(value),
  )
}

const formatDate = (value: string | null) => {
  if (!value) return '—'
  const date = value.slice(0, 10).split('-')
  return date.length === 3 ? `${date[2]}/${date[1]}/${date[0]}` : value
}

const getMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Não foi possível concluir a operação'

const App = () => {
  const [activeService, setActiveService] = useState<ServiceId>('animais')
  const [health, setHealth] = useState<HealthStatus>('checking')
  const [productionHealth, setProductionHealth] = useState<HealthStatus>('checking')
  const [animals, setAnimals] = useState<Animal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [sellTarget, setSellTarget] = useState<Animal | null>(null)
  const [origin, setOrigin] = useState<AnimalOrigin>('comprado')
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const previousHealth = useRef<HealthStatus>('checking')
  const deferredSearch = useDeferredValue(search)

  const loadAnimals = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    try {
      const data = await getAnimals()
      setAnimals(data)
    } catch (error) {
      setFormError(getMessage(error))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const verifyHealth = async () => {
    try {
      const healthy = await checkAnimalsHealth()
      const wasOffline = previousHealth.current === 'offline'
      previousHealth.current = healthy ? 'online' : 'offline'
      setHealth(healthy ? 'online' : 'offline')
      if (healthy && wasOffline) await loadAnimals(true)
    } catch {
      previousHealth.current = 'offline'
      setHealth('offline')
    }
  }

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    const poll = async () => {
      try {
        const healthy = await checkAnimalsHealth(controller.signal)
        if (!mounted) return
        const lastHealth = previousHealth.current
        previousHealth.current = healthy ? 'online' : 'offline'
        setHealth(healthy ? 'online' : 'offline')

        if (healthy && (lastHealth === 'checking' || lastHealth === 'offline')) {
          const data = await getAnimals()
          if (mounted) setAnimals(data)
        }
      } catch {
        if (mounted) {
          previousHealth.current = 'offline'
          setHealth('offline')
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    void poll()
    const interval = window.setInterval(poll, 10_000)
    return () => {
      mounted = false
      controller.abort()
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(null), 3_500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const filteredAnimals = animals.filter((animal) => {
    const term = deferredSearch.trim().toLocaleLowerCase('pt-BR')
    return !term || `${animal.nome} ${animal.tipo} ${animal.status}`.toLocaleLowerCase('pt-BR').includes(term)
  })

  const activeAnimals = animals.filter((animal) => !animal.vendido).length
  const soldAnimals = animals.length - activeAnimals

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    const values = new FormData(event.currentTarget)
    const base = {
      tipo: String(values.get('tipo')),
      nome: String(values.get('nome')),
    }
    const payload: CreateAnimalPayload =
      origin === 'comprado'
        ? {
            ...base,
            origem: 'comprado',
            valorCompra: Number(values.get('valorCompra')),
            dataCompra: String(values.get('dataCompra')),
          }
        : {
            ...base,
            origem: 'nascido',
            dataNascimento: String(values.get('dataNascimento')),
            maeId: Number(values.get('maeId')),
            ...(values.get('paiId') ? { paiId: Number(values.get('paiId')) } : {}),
          }

    try {
      await createAnimal(payload)
      await loadAnimals(true)
      setCreateOpen(false)
      setOrigin('comprado')
      setNotice('Animal cadastrado com sucesso')
    } catch (error) {
      setFormError(getMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSell = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!sellTarget) return
    setFormError(null)
    setIsSubmitting(true)
    const values = new FormData(event.currentTarget)

    try {
      await sellAnimal(sellTarget.id, {
        valorVenda: Number(values.get('valorVenda')),
        dataVenda: String(values.get('dataVenda')),
      })
      await loadAnimals(true)
      setSellTarget(null)
      setNotice(`${sellTarget.nome} marcado como vendido`)
    } catch (error) {
      setFormError(getMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Farmoo">
          <span className="brand-mark"><Beef size={22} /></span>
          <span>farmoo</span>
        </a>
        <div className="environment"><Warehouse size={15} /> Fazenda Principal</div>
      </header>

      <nav className="service-tabs" aria-label="Serviços" role="tablist">
        {serviceTabs.map(({ id, label, icon: Icon }) => (
          <button
            className={`service-tab ${activeService === id ? 'active' : ''}`}
            key={id}
            onClick={() => setActiveService(id)}
            role="tab"
            aria-selected={activeService === id}
            type="button"
          >
            <Icon size={18} />
            <span>{label}</span>
            <span className={`service-dot ${id === 'animais' ? health : id === 'producao' ? productionHealth : 'planned'}`} />
          </button>
        ))}
      </nav>

      <main>
        {activeService === 'animais' ? (
          <section className="workspace" aria-labelledby="animals-title">
            <div className="page-heading">
              <div>
                <p className="eyebrow">Rebanho</p>
                <h1 id="animals-title">Animais</h1>
              </div>
              <div className={`health-pill ${health}`}>
                {health === 'checking' ? <LoaderCircle className="spin" size={16} /> : health === 'online' ? <CircleCheck size={16} /> : <CircleAlert size={16} />}
                {health === 'checking' ? 'Verificando' : health === 'online' ? 'Serviço online' : 'Serviço indisponível'}
              </div>
            </div>

            {health === 'offline' ? (
              <div className="service-unavailable">
                <div className="unavailable-icon"><HeartPulse size={30} /></div>
                <h2>Serviço de animais indisponível</h2>
                <p>Os dados deste serviço não podem ser acessados agora. Os demais serviços continuam independentes.</p>
                <button className="secondary-button" onClick={() => void verifyHealth()} type="button">
                  <RefreshCw size={17} /> Tentar novamente
                </button>
              </div>
            ) : (
              <>
                <div className="summary-strip">
                  <div className="metric"><span>Total</span><strong>{animals.length}</strong></div>
                  <div className="metric"><span>Ativos</span><strong>{activeAnimals}</strong></div>
                  <div className="metric"><span>Vendidos</span><strong>{soldAnimals}</strong></div>
                  <div className="metric"><span>Atualização</span><strong className="metric-time"><Clock3 size={16} /> agora</strong></div>
                </div>

                <div className="toolbar">
                  <label className="search-field">
                    <Search size={17} />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome, tipo ou status" />
                  </label>
                  <div className="toolbar-actions">
                    <button className="icon-button" onClick={() => void loadAnimals(true)} title="Atualizar lista" type="button" disabled={isRefreshing}>
                      <RefreshCw className={isRefreshing ? 'spin' : ''} size={18} />
                    </button>
                    <button className="primary-button" onClick={() => { setFormError(null); setCreateOpen(true) }} type="button">
                      <Plus size={18} /> Novo animal
                    </button>
                  </div>
                </div>

                <div className="table-frame">
                  {isLoading ? (
                    <div className="table-state"><LoaderCircle className="spin" size={24} /> Carregando animais</div>
                  ) : filteredAnimals.length === 0 ? (
                    <div className="table-state"><PackageOpen size={28} /><strong>Nenhum animal encontrado</strong></div>
                  ) : (
                    <div className="table-scroll">
                      <table>
                        <thead><tr><th>Animal</th><th>Origem</th><th>Entrada / nascimento</th><th>Valor</th><th>Status</th><th aria-label="Ações" /></tr></thead>
                        <tbody>
                          {filteredAnimals.map((animal) => {
                            const AnimalIcon = animalIcons[animal.tipo] ?? Beef
                            return (
                              <tr key={animal.id}>
                                <td><div className="animal-cell"><span className="animal-icon"><AnimalIcon size={19} /></span><span><strong>{animal.nome}</strong><small>#{animal.id} · {animal.tipo}</small></span></div></td>
                                <td className="capitalize">{animal.origem}</td>
                                <td>{formatDate(animal.data_compra ?? animal.data_nascimento)}</td>
                                <td>{formatCurrency(animal.valor_compra ?? animal.valor_venda)}</td>
                                <td><span className={`status-tag ${animal.status}`}>{animal.status}</span></td>
                                <td className="action-cell">
                                  <button className="sell-button" disabled={animal.vendido} onClick={() => { setFormError(null); setSellTarget(animal) }} type="button">
                                    <ShoppingCart size={16} /> {animal.vendido ? 'Vendido' : 'Vender'}
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        ) : activeService === 'producao' ? (
          <ProducoesWorkspace animals={animals} onHealthChange={setProductionHealth} />
        ) : (
          <section className="workspace future-service">
            <div className="future-icon"><BadgeDollarSign size={30} /></div>
            <p className="eyebrow">Próximo serviço</p>
            <h1>Financeiro</h1>
            <p>A integração será habilitada quando o serviço estiver disponível.</p>
            <span className="planned-badge">Integração pendente</span>
          </section>
        )}
      </main>

      {createOpen && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false) }}>
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="create-title">
            <div className="dialog-header"><div><p className="eyebrow">Cadastro</p><h2 id="create-title">Novo animal</h2></div><button className="icon-button" onClick={() => setCreateOpen(false)} title="Fechar" type="button"><X size={19} /></button></div>
            <form onSubmit={handleCreate}>
              <div className="form-grid">
                <label><span>Nome</span><input name="nome" required maxLength={100} autoFocus /></label>
                <label><span>Tipo</span><select name="tipo" required><option value="vaca">Vaca</option><option value="boi">Boi</option><option value="cavalo">Cavalo</option><option value="jumento">Jumento</option><option value="galinha">Galinha</option><option value="ovelha">Ovelha</option><option value="porco">Porco</option><option value="pato">Pato</option></select></label>
              </div>
              <fieldset><legend>Origem</legend><div className="segmented"><button className={origin === 'comprado' ? 'selected' : ''} onClick={() => setOrigin('comprado')} type="button">Comprado</button><button className={origin === 'nascido' ? 'selected' : ''} onClick={() => setOrigin('nascido')} type="button">Nascido na fazenda</button></div></fieldset>
              {origin === 'comprado' ? (
                <div className="form-grid"><label><span>Valor da compra</span><div className="money-input"><span>R$</span><input name="valorCompra" type="number" min="0" max="99999999.99" step="0.01" required /></div></label><label><span>Data da compra</span><input name="dataCompra" type="date" required /></label></div>
              ) : (
                <><label><span>Data de nascimento</span><input name="dataNascimento" type="date" required /></label><div className="form-grid"><label><span>ID da mãe</span><input name="maeId" type="number" min="1" step="1" required /></label><label><span>ID do pai <small>opcional</small></span><input name="paiId" type="number" min="1" step="1" /></label></div></>
              )}
              {formError && <div className="form-error"><CircleAlert size={16} /> {formError}</div>}
              <div className="dialog-actions"><button className="secondary-button" onClick={() => setCreateOpen(false)} type="button">Cancelar</button><button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting && <LoaderCircle className="spin" size={17} />} Cadastrar</button></div>
            </form>
          </section>
        </div>
      )}

      {sellTarget && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSellTarget(null) }}>
          <section className="dialog dialog-small" role="dialog" aria-modal="true" aria-labelledby="sell-title">
            <div className="dialog-header"><div><p className="eyebrow">Venda</p><h2 id="sell-title">Vender {sellTarget.nome}</h2></div><button className="icon-button" onClick={() => setSellTarget(null)} title="Fechar" type="button"><X size={19} /></button></div>
            <form onSubmit={handleSell}>
              <label><span>Valor da venda</span><div className="money-input"><span>R$</span><input name="valorVenda" type="number" min="0" max="99999999.99" step="0.01" required autoFocus /></div></label>
              <label><span>Data da venda</span><input name="dataVenda" type="date" required /></label>
              {formError && <div className="form-error"><CircleAlert size={16} /> {formError}</div>}
              <div className="dialog-actions"><button className="secondary-button" onClick={() => setSellTarget(null)} type="button">Cancelar</button><button className="sale-action" disabled={isSubmitting} type="submit">{isSubmitting && <LoaderCircle className="spin" size={17} />} Confirmar venda</button></div>
            </form>
          </section>
        </div>
      )}

      {notice && <div className="toast"><CircleCheck size={18} /> {notice}</div>}
    </div>
  )
}

export default App
