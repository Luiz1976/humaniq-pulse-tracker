-- Verificar e adicionar política DELETE se não existir

-- Ver políticas atuais
SELECT 
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'website_content_posts';

-- Adicionar política DELETE se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'website_content_posts' 
        AND cmd = 'DELETE'
    ) THEN
        CREATE POLICY "Authenticated users can delete posts"
        ON website_content_posts FOR DELETE
        TO authenticated
        USING (true);
        
        RAISE NOTICE 'Política DELETE criada com sucesso';
    ELSE
        RAISE NOTICE 'Política DELETE já existe';
    END IF;
END $$;

-- Verificar novamente
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'website_content_posts'
ORDER BY cmd;
